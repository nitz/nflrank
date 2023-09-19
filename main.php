<?php
declare(strict_types=1);

final class ApplicationVersion {
	public const /*int*/ MAJOR = 2;
	public const /*int*/ MINOR = 0;
	public const /*int*/ PATCH = 5;
	public const VERSION = "v" . self::MAJOR . "." . self::MINOR . "." . self::PATCH;

	public static function get(): string {
		$is_repo = filter_var(trim(exec('git rev-parse --is-inside-work-tree')));

		if (!$is_repo) {
			return self::VERSION . " (no repo)";
		}

		$branch = trim(exec('git rev-parse --abbrev-ref HEAD'));
		$hash = trim(exec('git describe --dirty --always --tags'));
		$when = new \DateTime(trim(exec('git log -n1 --pretty=%ci HEAD')));
		$when->setTimezone(new \DateTimeZone(Main::DEFAULT_TIMEZONE));

		return sprintf('v%s.%s.%s-%s.%s (%s)', self::MAJOR, self::MINOR, self::PATCH, $branch, $hash, $when->format('Y-m-d H:i:s'));
	}
}

final class Main {

	private const /*int*/ LEAGUE_YEAR = 2023;
	private const /*string*/ DATA_FOLDER = './data/';

	private const /*string*/ DATA_EXPECTED_VERSION = '1.0';
	private const /*int*/ ONE_HOUR_SECONDS = 3600;
	private const /*string*/ GAME_STATE_SCHEDULED = 'SCHED';
	private const /*string*/ GAME_STATE_LIVE = 'INPROG';
	private const /*string*/ GAME_STATE_FINAL = 'FINAL';

	public const /*string*/ DEFAULT_TIMEZONE = 'America/New_York';

	private array $_settings = [
		'data_api_old_uri' => 'https://api.myfantasyleague.com/' . self::LEAGUE_YEAR . '/export?TYPE=nflSchedule&W=ALL&JSON=1',
		'data_api_uri' => 'https://api.myfantasyleague.com/fflnetdynamic' . self::LEAGUE_YEAR . '/nfl_sched.json',
		'data_api_week_uri' => 'https://api.myfantasyleague.com/fflnetdynamic' . self::LEAGUE_YEAR . '/nfl_sched_%d.json',
		'data_file_sched' => self::DATA_FOLDER . 'sched.json',
		'data_file_week' => self::DATA_FOLDER . 'week.json',
		'data_file_merged' => self::DATA_FOLDER . 'full.json',
		'data_update_seconds' => self::ONE_HOUR_SECONDS,
		'data_update_live_seconds' => 15,
	];

	private int $_weekNumber = 0;
	private bool $_isLive;
	private bool $_isFinal;
	private string $_weekState = '?';

	// the main entry point for the application.
	public function run(): void {
		date_default_timezone_set(self::DEFAULT_TIMEZONE);

		$this->updateLiveStatus($this->_settings['data_file_merged']);

		// update the data if needed, and if we do, re-update live status
		if ($this->updateData()) {
			$this->updateLiveStatus($this->_settings['data_file_merged']);
		}
	}

	// gets a string representing the application version
	public function getVersion(): string {
		return ApplicationVersion::get();
	}

	// gets a short string representing the application version
	public function getVersionShort(): string {
		return ApplicationVersion::VERSION;
	}

	// gets a string representing the date and time the data was last updated
	public function getDataLastModifiedDate(): string {
		$file = $this->_settings['data_file_merged'];
		if (!file_exists($file)) {
			return 'Updating, please refresh...';
		}

		$stats = stat($file);
		if (is_array($stats)) {
			$mtime = $stats['mtime'];
			$mdate = new \DateTime();
			$mdate->setTimestamp($mtime);
			$age = Utilities::getElapsedTimeAsHumanReadableString($mdate);
			//return gmdate("Y-m-d\TH:i:s\Z", $mtime);
			return date('c', $mtime) . " ($age)";
		}

		return '?';
	}

	// returns a number representing which week of the season it is
	public function getCurrentWeek(): int {
		return $this->_weekNumber;
	}

	// gets a string that *should* correspond to the cell the user
	// should be pasting their rankings in for the current week.
	public function getCurrentWeekCellName(): string {
		$column = chr(ord('B') + $this->_weekNumber); // column B is week 0.
		$row = 2; // for now, row is always 2.
		return "{$column}{$row}";
	}

	// returns a string representing the current week's state
	public function getCurrentWeekState(): string {
		return $this->_weekState;
	}

	// returns true if the data is stale, otherwise false
	private function isDataStale(string $file, int $stale_seconds): bool {

		$stale = true;

		if (!file_exists($file)) {
			return $stale;
		}

		$stats = stat($file);

		if (is_array($stats)) {
			$now = strtotime('now');
			$mtime = $stats['mtime'];
			$delta = $now - $mtime;
			$stale = $delta >= $stale_seconds;
		}

		return $stale;
	}

	// checks if the data is stale, and attempts to update it, if it is.
	// returns true if the data was updated, false otherwise.
	private function updateData(): bool {
		$data_file_sched = $this->_settings['data_file_sched'];
		$data_file_week = $this->_settings['data_file_week'];
		$data_file_merged = $this->_settings['data_file_merged'];

		if ($this->isDataStale($data_file_sched, $this->_settings['data_update_seconds'])) {
			Utilities::fetchFileAndWriteToDisk($this->_settings['data_api_uri'], $data_file_sched);
		}

		// we can use the schedule to figure out what week we're in.
		$this->updateWeek($data_file_sched);

		// if we are live, we can update more often.
		$stale_time = $this->_isLive
			? $this->_settings['data_update_live_seconds']
			: $this->_settings['data_update_seconds'];

		if ($this->isDataStale($data_file_week, $stale_time)) {
			$uri = sprintf($this->_settings['data_api_week_uri'], $this->_weekNumber);
			Utilities::fetchFileAndWriteToDisk($uri, $data_file_week);
		}

		Utilities::fetchTempFileCleanup();

		$this->checkAndMerge($data_file_merged, $data_file_sched, $data_file_week);

		return true;
	}

	// checks if either the schedule data or week data is newer than merged.
	// if so, merges the week data into the schedule data, and saves it as merged.
	// this is because the week info updates more regularly than the full schedule.
	private function checkAndMerge(string $merged, string $sched, string $week): void {
		$merged_mtime = Utilities::getFileMtime($merged);
		$sched_mtime = Utilities::getFileMtime($sched);
		$week_mtime = Utilities::getFileMtime($week);

		if ($sched_mtime == false) {
			throw new Exception('Unable to get mtime for schedule data.');
		}

		if ($week_mtime == false) {
			throw new Exception('Unable to get mtime for week data.');
		}

		if ($merged_mtime == false ||
			($sched_mtime > $merged_mtime ||
				$week_mtime > $merged_mtime)) {
			// grab both data files
			$data_sched_json = file_get_contents($sched);
			$data_week_json = file_get_contents($week);

			// decode the json
			$data_sched = json_decode($data_sched_json);
			$data_week = json_decode($data_week_json);

			// merge the week info into the proper spot in the full schedule
			$data_week_week_number = $data_week->nflSchedule->week;
			$data_sched->fullNflSchedule->nflSchedule[$data_week_week_number - 1] = $data_week->nflSchedule;

			// and save it as the merged.
			$data_merged_json = json_encode($data_sched);
			file_put_contents($merged, $data_merged_json);
		}
	}

	// uses the latest data to determine a few stats about the state of the week.
	private function updateLiveStatus(string $target_file): void {
		$this->_weekNumber = 0;
		$this->_isLive = false;
		$this->_isFinal = false;
		$this->_weekState = "?";

		// if we don't have a data file, assume we are 'live' til we fetch one.
		if (!file_exists($target_file)) {
			$this->_isLive = true;
			return;
		}

		$data_json = file_get_contents($target_file);
		$data = json_decode($data_json);

		if ($data->version != self::DATA_EXPECTED_VERSION) {
			throw new Exception("Unexpected data version: {$data->version}");
		}

		$now = strtotime('now'); // now as a timestamp

		$schedule = $data->fullNflSchedule->nflSchedule;

		foreach ($schedule as $index => $week) {
			$week_number = intval($week->week);

			$past_kickoff = false;
			$has_scheduled_game = false;
			$has_live_game = false;
			$has_final_game = false;

			if (isset($week->matchup) == false) {
				continue;
			}

			foreach ($week->matchup as $game) {
				if ($now >= $game->kickoff) {
					$past_kickoff = true;
				}
				switch ($game->status) {
					case self::GAME_STATE_SCHEDULED:
						$has_scheduled_game = true;
						break;
					case self::GAME_STATE_LIVE:
						$has_live_game = true;
						break;
					case self::GAME_STATE_FINAL:
						$has_final_game = true;
						break;
					default:
						throw new Exception("Unexpected game status: {$game->status}");
						break;
				}
			}

			if (!$past_kickoff && !$has_final_game && !$has_live_game && $has_scheduled_game) {
				break;
			}

			// if we have a final or live game and this is a larger week number,
			// that is the active week we're in.
			if (($past_kickoff || $has_final_game || $has_live_game) && ($week_number > $this->_weekNumber)) {
				$this->_weekNumber = $week_number;
				$this->_isFinal = !$has_scheduled_game  && !$has_live_game;
				$this->_weekState = ($has_live_game || $has_scheduled_game) ? 'Live' : 'Final';
			}

			$this->_isLive = $this->_isLive || $has_live_game;
		}
	}

	// uses the given data file to try and determine which week of the season we're in my checking the current time against kickoff times
	private function updateWeek(string $target_file): void {
		$this->_weekNumber = 0;

		// if we don't have a data file, assume we are 'live' til we fetch one.
		if (!file_exists($target_file)) {
			throw new Exception('No file to read data from, unable to determine week.');
		}

		$data_json = file_get_contents($target_file);
		$data = json_decode($data_json);

		if ($data->version != self::DATA_EXPECTED_VERSION) {
			throw new Exception("Unexpected data version: {$data->version}");
		}

		$now = strtotime('now'); // now as a timestamp

		$schedule = $data->fullNflSchedule->nflSchedule;

		foreach ($schedule as $index => $week) {
			$week_number = intval($week->week);

			if (isset($week->matchup) == false) {
				continue;
			}

			foreach ($week->matchup as $game) {
				if ($now >= $game->kickoff) {
					$this->_weekNumber = $week_number;
					break;
				}
			}

			if ($this->_weekNumber < $week_number) {
				break;
			}
		}
	}
}

final class Utilities {
	private const /*string*/ TEMP_DATA_FOLDER = './';
	private const /*string*/ TEMP_DATA_PREFIX = 'curl-';

	public static function fetchFileAndWriteToDisk(string $remote_uri, string $destination_file): void {
		$tmp_filename = tempnam(self::TEMP_DATA_FOLDER, self::TEMP_DATA_PREFIX);

		if (!$tmp_filename) {
			throw new Exception('Failed to get temporary file!');
		}

		$tmp_file = fopen($tmp_filename, "w");

		$curl = curl_init();

		curl_setopt($curl, CURLOPT_URL, $remote_uri);

		curl_setopt($curl, CURLOPT_BINARYTRANSFER, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);

		curl_setopt($curl, CURLOPT_FILE, $tmp_file);

		curl_exec($curl);

		$http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

		curl_close($curl);

		fclose($tmp_file);

		if ($http_status != 200) {
			throw new Exception("Remote URI returned unexpected response code: $http_status");
		}

		if (file_exists($destination_file) && !unlink($destination_file)) {
			throw new Exception("Failed to remove already existing destination file.");
		}

		if (!is_dir(dirname($destination_file)) && !mkdir(dirname($destination_file), 0755, true)) {
			throw new Exception("Failed to move create destination directory.");
		}

		if (!rename($tmp_filename, $destination_file)) {
			throw new Exception("Failed to move temporary file to destination.");
		}

		if (!chmod($destination_file, 0644)) {
			throw new Exception("Failed to make destination file readable.");
		}

		if (!touch($destination_file)) {
			throw new Exception("Failed to touch destination file.");
		}
	}

	public static function fetchTempFileCleanup(): void {
		$files = glob(self::TEMP_DATA_FOLDER . self::TEMP_DATA_PREFIX . "*");
		
		foreach ($files as $file) {
			if (file_exists($file) && !unlink($file)) {
				throw new Exception("Failed to remove temporary file: '$file'");
			}
		}
	}

	// https://stackoverflow.com/a/18602474
	public function getElapsedTimeAsHumanReadableString($datetime_or_string, bool $full = false): string {
		$now = new \DateTime;
		$ago = is_a($datetime_or_string, 'DateTime')
			? $datetime_or_string
			: new \DateTime($datetime_or_string);
		$diff = $now->diff($ago);

		$diff->w = floor($diff->d / 7);
		$diff->d -= $diff->w * 7;

		$string = array(
			'y' => 'year',
			'm' => 'month',
			'w' => 'week',
			'd' => 'day',
			'h' => 'hour',
			'i' => 'minute',
			's' => 'second',
		);

		foreach ($string as $k => &$v) {
			if ($diff->$k) {
				$v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
			} else {
				unset($string[$k]);
			}
		}

		if (!$full) $string = array_slice($string, 0, 1);
		return $string ? implode(', ', $string) . ' ago' : 'just now';
	}

	public function getFileMtime($file) {
		if (!file_exists($file)) {
			return false;
		}

		$stats = stat($file);

		if (!is_array($stats)) {
			return false;
		}

		return $stats['mtime'];
	}

}
