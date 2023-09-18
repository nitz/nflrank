
// stats & user data
const STATS = new Map();
const DATA = {
	currentWeek: 0,
	isSortable: false,
}

// utility functions for sorting arrays

function by_name(l, r) {
	return l.name.localeCompare(r.name);
}

function by_rank(l, r) {
	return l.rank - r.rank;
}

function by_original_rank(l, r) {
	return l.originalRank - r.originalRank;
}

// constant data

// filler for unknown table values and other text representations
const PLACEHOLDER_TEXT = ' — ';
const HOME_SYMBOL = '';
const AWAY_SYMBOL = '@';

// strings representing win/loss/ties
const STAT_RESULT_WIN = 'W';
const STAT_RESULT_LOSS = 'L';
const STAT_RESULT_TIE = 'T';

// class names to look up elements
const CLASS_NAME_TEAM = 'team';
const CLASS_NAME_RANK = 'rank';
const CLASS_NAME_LOGO = 'logo';
const CLASS_NAME_NAME = 'name';
const CLASS_NAME_DELTA = 'delta';
const CLASS_NAME_RECORD = 'record';
const CLASS_NAME_DIFFERENTIAL = 'differential';
const CLASS_NAME_STREAK = 'streak';
const CLASS_NAME_LAST = 'last';
const CLASS_NAME_LAST_HEADER = 'last-week-header';
const CLASS_NAME_MOVERS = 'movers';
const CLASS_FRAGMENT_COLOR_BACKGROUND = '-bg';

const CLASS_NAME_POSITIVE = 'points-positive';
const CLASS_NAME_NEGATIVE = 'points-negative';
const CLASS_NAME_NEUTRAL = 'points-neutral';

const CLASS_NAME_STREAK_WIN = 'streak-w';
const CLASS_NAME_STREAK_LOSS = 'streak-l';
const CLASS_NAME_STREAK_TIE = 'streak-t';

const CLASS_NAME_DELTA_GLOW_RANK_UP = 'delta-glow-rank-up';
const CLASS_NAME_DELTA_GLOW_RANK_DOWN = 'delta-glow-rank-down';

const CLASS_NAME_LAST_FINAL = 'last-final';
const CLASS_NAME_LAST_LIVE = 'last-live';
const CLASS_NAME_LAST_SCHEDULED = 'last-scheduled';

// the table columns to create
const TABLE_COLUMNS = [ '#', '', ['Team', CLASS_NAME_NAME], ['∆', CLASS_NAME_DELTA], 'W-L', 'Pts', 'Strk', ['Last', CLASS_NAME_LAST_HEADER] ];

// specific element selectors
const TABLE_ELEMENT_SELECTOR = '#the-league';
const TABLE_HEADER_ROW_ELEMENT_SELECTOR = `${TABLE_ELEMENT_SELECTOR} thead tr`;
const TEAMS_ELEMENT_SELECTOR = '#teams';
const DEBUG_ELEMENT_SELECTOR = '#debug';
const INPUT_TEXTAREA_SELECTOR = '#numbers-input';
const OUTPUT_TEXTAREA_SELECTOR = '#numbers-output';
const TEAMS_TEXTAREA_SELECTOR = '#numbers-teams';

// attribute names
const DATA_CURRENT_WEEK_ATTR_NAME = 'data-live-week';
const DATA_TEAM_ID_ATTR = 'data-team-id';

// constant strings from league data
const DATA_GAME_STATUS_SCHEDULED = 'SCHED';
const DATA_GAME_STATUS_LIVE = 'INPROG';
const DATA_GAME_STATUS_FINAL = 'FINAL';

const DATA_GAME_WEEKS_START = 1;
const DATA_GAME_WEEKS_END = 18;

// believe it or not, NFL teams!
const TEAMS = [
	{
		name: 'Bills',
		id: 'buf',
		apiID: 'BUF',
		loc: 'Buffalo'
	}, {
		name: 'Dolphins',
		id: 'mia',
		apiID: 'MIA',
		loc: 'Miami'
	}, {
		name: 'Patriots',
		id: 'ne',
		apiID: 'NEP',
		loc: 'New England'
	}, {
		name: 'Jets',
		id: 'nyj',
		apiID: 'NYJ',
		loc: 'New York'
	}, {
		name: 'Ravens',
		id: 'bal',
		apiID: 'BAL',
		loc: 'Baltimore'
	}, {
		name: 'Bengals',
		id: 'cin',
		apiID: 'CIN',
		loc: 'Cincinatti'
	}, {
		name: 'Browns',
		id: 'cle',
		apiID: 'CLE',
		loc: 'Cleveland'
	}, {
		name: 'Steelers',
		id: 'pit',
		apiID: 'PIT',
		loc: 'Pittsburgh'
	}, {
		name: 'Texans',
		id: 'hou',
		apiID: 'HOU',
		loc: 'Houston'
	}, {
		name: 'Colts',
		id: 'ind',
		apiID: 'IND',
		loc: 'Indianapolis'
	}, {
		name: 'Jaguars',
		id: 'jax',
		apiID: 'JAC',
		loc: 'Jacksonville'
	}, {
		name: 'Titans',
		id: 'ten',
		apiID: 'TEN',
		loc: 'Tennessee'
	}, {
		name: 'Broncos',
		id: 'den',
		apiID: 'DEN',
		loc: 'Denver'
	}, {
		name: 'Chiefs',
		id: 'kc',
		apiID: 'KCC',
		loc: 'Kansas City'
	}, {
		name: 'Raiders',
		id: 'lv',
		apiID: 'LVR',
		loc: 'Las Vegas'
	}, {
		name: 'Chargers',
		id: 'lac',
		apiID: 'LAC',
		loc: 'Los Angeles'
	}, {
		name: 'Cowboys',
		id: 'dal',
		apiID: 'DAL',
		loc: 'Dallas'
	}, {
		name: 'Giants',
		id: 'nyg',
		apiID: 'NYG',
		loc: 'New York'
	}, {
		name: 'Eagles',
		id: 'phi',
		apiID: 'PHI',
		loc: 'Philadelphia'
	}, {
		name: 'Commanders',
		id: 'was',
		apiID: 'WAS',
		loc: 'Washington'
	}, {
		name: 'Bears',
		id: 'chi',
		apiID: 'CHI',
		loc: 'Chicago'
	}, {
		name: 'Lions',
		id: 'det',
		apiID: 'DET',
		loc: 'Detroit'
	}, {
		name: 'Packers',
		id: 'gb',
		apiID: 'GBP',
		loc: 'Green Bay'
	}, {
		name: 'Vikings',
		id: 'min',
		apiID: 'MIN',
		loc: 'Minnesota'
	}, {
		name: 'Falcons',
		id: 'atl',
		apiID: 'ATL',
		loc: 'Atlanta'
	}, {
		name: 'Panthers',
		id: 'car',
		apiID: 'CAR',
		loc: 'Carolina'
	}, {
		name: 'Saints',
		id: 'no',
		apiID: 'NOS',
		loc: 'New Orleans'
	}, {
		name: 'Buccaneers',
		id: 'tb',
		apiID: 'TBB',
		loc: 'Tampa Bay'
	}, {
		name: 'Cardinals',
		id: 'ari',
		apiID: 'ARI',
		loc: 'Arizona'
	}, {
		name: '49ers',
		id: 'sf',
		apiID: 'SFO',
		loc: 'San Francisco'
	}, {
		name: 'Seahawks',
		id: 'sea',
		apiID: 'SEA',
		loc: 'Seattle'
	}, {
		name: 'Rams',
		id: 'lar',
		apiID: 'LAR',
		loc: 'Los Angeles'
	},
].sort(by_name);

// A class representing a teams' stats and user rankings
class TeamStats {
	constructor(id) {
		this.team = null;
		this.id = id;
		this.originalRank = 0;
		this.rank = 0;
		this.emptyStats();
	}

	// gets a signed number representing how many ranks the team has changed
	get rankDelta() {
		return this.originalRank - this.rank;
	}

	// gets a signed number representing the point delta for the team
	get pointsDelta() {
		return this.pointsFor - this.pointsAgainst;
	}

	// gets a string representing the current streak for the team
	get streak() {
		if (this.results.length == 0) {
			return PLACEHOLDER_TEXT;
		}

		let mode = '';
		let length = 0;

		this.results.forEach(result => {
			if (result == mode) {
				length++;
			} else {
				mode = result;
				length = 1;
			}
		});

		return `${mode}${length}`;
	}

	// gets the last result for the team (W/L/T)
	get lastResult() {
		return this.results.at(-1);
	}

	// gets the W-L record for the team, additionally with ties if any.
	get record() {
		if (this.ties != 0) {
			return `${this.wins}-${this.losses}-${this.ties}`;
		}

		return `${this.wins}-${this.losses}`;
	}

	// zeroes out all of the teams stats
	emptyStats() {
		this.wins = 0;
		this.losses = 0;
		this.ties = 0;
		this.results = [];
		this.last = PLACEHOLDER_TEXT;
		this.next = PLACEHOLDER_TEXT;
		this.lastIsLive = false;
		this.pointsFor = 0;
		this.pointsAgainst = 0;
	}

	// private method that adds the result & data to the team's stats
	#addResult(result, data_us, data_them) {

		switch (result)
		{
			case STAT_RESULT_WIN:
				this.wins++;
				break;
			case STAT_RESULT_LOSS:
				this.losses++;
				break;
			case STAT_RESULT_TIE:
				this.ties++;
				break;
			default:
				return;
		}

		this.results.push(result);
		this.pointsFor += Number(data_us.score);
		this.pointsAgainst += Number(data_them.score);
		let away_char = (data_us.isHome != 0) ? HOME_SYMBOL : AWAY_SYMBOL;
		this.last = `${data_us.score}-${data_them.score} ${away_char}${data_them.teamID}`.toUpperCase();
		this.lastIsPending = false;
		this.lastIsLive = false;
	}

	// adds a win to the team's stats
	addWin(data_us, data_them) {
		this.#addResult(STAT_RESULT_WIN, data_us, data_them);
	}

	// adds a loss to the team's stats
	addLoss(data_us, data_them) {
		this.#addResult(STAT_RESULT_LOSS, data_us, data_them);
	}

	// adds a tie to the team's stats
	addTie(data_us, data_them) {
		this.#addResult(STAT_RESULT_TIE, data_us, data_them);
	}

	// sets the 'last' match as a pending game (when the week is live but the team hasn't played yet.)
	setPendingMatchup(data_us, data_them) {
		let away_char = (data_us.isHome != 0) ? HOME_SYMBOL : AWAY_SYMBOL;
		this.last = `${away_char}${data_them.teamID}`.toUpperCase();
		this.lastIsPending = true;
		this.lastIsLive = false;
	}

	// sets the 'last' matchup as a currently live game!
	setLiveMatchup(data_us, data_them) {
		let away_char = (data_us.isHome != 0) ? HOME_SYMBOL : AWAY_SYMBOL;
		this.last = `${data_us.score}-${data_them.score} ${away_char}${data_them.teamID}`.toUpperCase();
		this.lastIsPending = false;
		this.lastIsLive = true;
	}

	// sets the 'next' matchup to use for the 'last' column if we are looking at next weeks.
	setNextMatchup(data_us, data_them) {
		let away_char = (data_us.isHome != 0) ? HOME_SYMBOL : AWAY_SYMBOL;
		this.next = `${away_char}${data_them.teamID}`.toUpperCase();
	}
}

// converts an 'API ID' (from league stat data) to the shorthand ID used in this app.
function api_id_to_id(api_id) {
	let team = TEAMS.find(t => t.apiID == api_id);
	return team.id;
}

// returns an existing team stats object from the user data, or creates and stores one
// if there isn't already one, and returns that.
function get_or_add_team_stats(id) {
	if (STATS.has(id)) {
		return STATS.get(id);
	}

	let new_stats = new TeamStats(id);
	STATS.set(id, new_stats);
	return new_stats;
}

// calculates the stats (streak, points, etc.) for each team from league data
function calculate_stats(data) {
	// clear any current stats
	STATS.forEach(stat => {
		stat.emptyStats();
	});

	const raw = data.fullNflSchedule.nflSchedule;
	raw.forEach(week => {
		let week_number = week.week;

		if (week_number < DATA_GAME_WEEKS_START ||
			week_number > DATA_GAME_WEEKS_END) {
			return;
		}

		let is_current_week = DATA.currentWeek == week_number;
		let is_next_week = (DATA.currentWeek + 1) == week_number;

		week.matchup.forEach(match => {
			let data0 = match.team[0];
			let data1 = match.team[1];

			let id0 = api_id_to_id(data0.id);
			let id1 = api_id_to_id(data1.id);

			data0.teamID = id0;
			data1.teamID = id1;

			let team0 = get_or_add_team_stats(id0);
			let team1 = get_or_add_team_stats(id1);

			if (match.status == DATA_GAME_STATUS_FINAL) {
				// score comes in as a string, make sure it's a number so compares are correct.
				let score0 = Number(data0.score);
				let score1 = Number(data1.score);
				// matches that are final add to W/L/T
				if (score0 > score1) {
					team0.addWin(data0, data1);
					team1.addLoss(data1, data0);
				} else if (score1 > score0) {
					team0.addLoss(data0, data1);
					team1.addWin(data1, data0);
				} else {
					team0.addTie(data0, data1);
					team1.addTie(data1, data0);
				}
			} else if (match.status == DATA_GAME_STATUS_SCHEDULED && is_current_week) {
				// scheduled games are 'pending' for this week
				team0.setPendingMatchup(data0, data1);
				team1.setPendingMatchup(data1, data0);
			} else if (match.status == DATA_GAME_STATUS_LIVE) {
				// live games are playing now!
				team0.setLiveMatchup(data0, data1);
				team1.setLiveMatchup(data1, data0);
			}

			if (is_next_week) {
				team0.setNextMatchup(data0, data1);
				team1.setNextMatchup(data1, data0);
			}
		});
	});
}

// populates calculated stats into the table elements, and adjusts display classes as needed.
function populate_stats() {
	STATS.forEach(stat => {
		let team_ele = $(TEAMS_ELEMENT_SELECTOR).find(`[${DATA_TEAM_ID_ATTR}="${stat.id}"]`);

		// update team record
		team_ele.children(`.${CLASS_NAME_RECORD}`).text(stat.record);

		// update point differential
		update_signed_value_element(team_ele.children(`.${CLASS_NAME_DIFFERENTIAL}`), stat.pointsDelta, false);

		// update win/loss/tie streak
		let streak_ele = team_ele.children(`.${CLASS_NAME_STREAK}`)
		streak_ele.text(stat.streak);

		streak_ele.removeClass(CLASS_NAME_STREAK_WIN);
		streak_ele.removeClass(CLASS_NAME_STREAK_LOSS);
		streak_ele.removeClass(CLASS_NAME_STREAK_TIE);

		switch (stat.lastResult)
		{
			case STAT_RESULT_WIN:
				streak_ele.addClass(CLASS_NAME_STREAK_WIN);
				break;
			case STAT_RESULT_LOSS:
				streak_ele.addClass(CLASS_NAME_STREAK_LOSS);
				break;
			case STAT_RESULT_TIE:
				streak_ele.addClass(CLASS_NAME_STREAK_TIE);
				break;
		}

		// update teams 'last' game.
		let last_ele = team_ele.children(`.${CLASS_NAME_LAST}`);
		last_ele.text(stat.last);

		last_ele.removeClass(CLASS_NAME_LAST_FINAL);
		last_ele.removeClass(CLASS_NAME_LAST_LIVE);
		last_ele.removeClass(CLASS_NAME_LAST_SCHEDULED);

		if (stat.lastIsScheduled) {
			last_ele.addClass(CLASS_NAME_LAST_SCHEDULED);
		} else if (stat.lastIsLive) {
			last_ele.addClass(CLASS_NAME_LAST_LIVE);
		} else {
			last_ele.addClass(CLASS_NAME_LAST_FINAL);
		}
	});

	populate_rank_and_delta_display();

	$(`.${CLASS_NAME_LAST_HEADER}`).text(`Week ${DATA.currentWeek}`);
}

// updates each team row with it's current user rank,
// as well as updating the delta from the rank it started at.
function populate_rank_and_delta_display() {
	STATS.forEach(stat => {
		let team_ele = $(TEAMS_ELEMENT_SELECTOR).find(`[${DATA_TEAM_ID_ATTR}="${stat.id}"]`);

		// update the rank display
		team_ele.children(`.${CLASS_NAME_RANK}`).text(`${stat.rank}`);

		// update the delta rank display
		let rank_delta = stat.rankDelta;
		update_signed_value_element(team_ele.children(`.${CLASS_NAME_DELTA}`), stat.rankDelta, true);

		team_ele.removeClass(CLASS_NAME_DELTA_GLOW_RANK_UP);
		team_ele.removeClass(CLASS_NAME_DELTA_GLOW_RANK_DOWN);

		if (rank_delta > 0) {
			team_ele.addClass(CLASS_NAME_DELTA_GLOW_RANK_UP);
		} else if (rank_delta < 0) {
			team_ele.addClass(CLASS_NAME_DELTA_GLOW_RANK_DOWN);
		}
	});
}

// updates an element's text with the given value,
// and assigns a positive/neutral/negative class based on the value.
function update_signed_value_element(element, value, zero_is_placeholder) {
	let text_value = `${value}`;

	element.removeClass(CLASS_NAME_POSITIVE);
	element.removeClass(CLASS_NAME_NEGATIVE);
	element.removeClass(CLASS_NAME_NEUTRAL);

	if (value > 0) {
		element.addClass(CLASS_NAME_POSITIVE);
		text_value = `+${text_value}`;
	} else if (value < 0) {
		element.addClass(CLASS_NAME_NEGATIVE);
	} else {
		element.addClass(CLASS_NAME_NEUTRAL);
		if (zero_is_placeholder) {
			text_value = PLACEHOLDER_TEXT;
		}
	}

	element.text(text_value);
}

function make_teams_sortable() {
	sortable(TEAMS_ELEMENT_SELECTOR, {
		items: 'tr:not([disabled])',
		forcePlaceholderSize: true,
		placeholderClass: 'team-drag-placeholder',
		hoverClass: 'team-drag-hover'
	})[0].addEventListener('sortupdate', on_sort_change);

	DATA.isSortable = true;
}

// handler for successful league data retrieval
function on_data_fetched(data) {

	// no data? nothing to do.
	if (data == null) {
		return;
	}

	let ele_table = $(TABLE_ELEMENT_SELECTOR);
	DATA.currentWeek = ele_table.attr(DATA_CURRENT_WEEK_ATTR_NAME);

	// now that we have the data, calculate & populate the stats,
	// then finally let the user start sorting!
	calculate_stats(data);
	populate_stats();
	make_teams_sortable();
}

// creates the table headers based on the TABLE_COLUMNS array.
function create_table_headers() {
	let ele_thead = $(TABLE_HEADER_ROW_ELEMENT_SELECTOR);

	TABLE_COLUMNS.forEach(h => {
		if (Array.isArray(h)) {
			let classes = h.slice(1).join(' ');
			ele_thead.append(`<th class="${classes}">${h[0]}</th>`);
		} else {
			ele_thead.append(`<th>${h}</th>`);
		}
	});
}

// clears all table rows that represent a team
function clear_team_rows() {
	let removals = $(TEAMS_ELEMENT_SELECTOR).children('tr:not([disabled])');
	removals.remove();
}

// creates the element for a team row.
function create_team_row(team, rank) {
	let color_class_bg = `${team.id}${CLASS_FRAGMENT_COLOR_BACKGROUND}`;
	let color_class_bf = `${team.id}`;
	let proto = `<tr class="${CLASS_NAME_TEAM} ${color_class_bg}"
			${DATA_TEAM_ID_ATTR}="${team.id}"
			>
			<td class="${CLASS_NAME_RANK}">${rank}</td>
			<td class="${CLASS_NAME_LOGO}"><div style="background-image:url(./logos/${team.id}.svg);"></div></td>
			<td class="${CLASS_NAME_NAME} ">${team.loc} ${team.name}</td>
			<td class="${CLASS_NAME_DELTA}">${PLACEHOLDER_TEXT}</td>
			<td class="${CLASS_NAME_RECORD}">${PLACEHOLDER_TEXT}</td>
			<td class="${CLASS_NAME_DIFFERENTIAL}">${PLACEHOLDER_TEXT}</td>
			<td class="${CLASS_NAME_STREAK}">${PLACEHOLDER_TEXT}</td>
			<td class="${CLASS_NAME_LAST}">${PLACEHOLDER_TEXT}</td>
			<!--
				Not sure if move buttons are needed now.
				<td class="${CLASS_NAME_MOVERS}">⬆⬇</td>
			-->
		</tr>`;
	return $(proto);
}

// creates table rows for each team, and makes them sortable
function create_team_rows() {
	let ele_teams = $(TEAMS_ELEMENT_SELECTOR);

	TEAMS.forEach(team => {
		let team_stats = get_or_add_team_stats(team.id);
		team.element = create_team_row(team, team_stats.rank);
		ele_teams.append(team.element);
	});
}

// handler for when the sort of the teams changes.
// recalculates each team rank,
// updates their display & delta in the table,
// and finally updates the output text.
function on_sort_change(e) {
	let rank = 1;
	e.detail.destination.items.forEach((item, index) => {
		let team_id = $(item).attr(DATA_TEAM_ID_ATTR);

		// ignore non-team rows.
		if (!team_id) {
			return;
		}

		// get the team and assign the new rank
		let stats = get_or_add_team_stats(team_id);
		stats.rank = rank;

		rank++;
	});

	populate_rank_and_delta_display();

	fill_textarea_by_data(OUTPUT_TEXTAREA_SELECTOR);
}

// fills the list of teams between the input & output text areas
function fill_teams_textarea() {

	let output = '';

	// for all the teams, get their name and add it to the output string
	TEAMS.forEach(team => {
		output += `${team.name}\r\n`;
	});

	// populate the teams textarea.
	$(TEAMS_TEXTAREA_SELECTOR).val(output);
}

// fills the given text area with the rank for each team
function fill_textarea_by_data(selector) {

	let output = '';

	// for all the teams, get their rank and add it to the output string
	TEAMS.forEach(team => {
		let stats = get_or_add_team_stats(team.id);
		output += `${stats.rank}\r\n`;
	});

	// populate the output textarea.
	$(selector).val(output.trim());
}

// takes the input text area value and uses it to
// sort the team array, applying those values as the
// original rank, used to calculate the 'delta' for each team.
//
// expects the text area to have exactly 32 rows of numbers
// between 1 and 32 inclusive.
function load_input_to_ranks() {

	// don't load if we aren't sortable yet.
	if (DATA.isSortable == false) {
		return;
	}

	// split the input text by whitespace
	let text = $(INPUT_TEXTAREA_SELECTOR).val().trim();
	let parts = text.split(/\s+/);

	// we only operate on exactly 32 numbers.
	if (parts.length != 32) {
		alert('Please make sure you pasted exactly 32 rows of numbers!');
		return;
	}

	// check to make sure each of the 32 parts is, in fact, a number between 1-32
	let cancel = false;
	parts.forEach(p => {
		if (cancel) {
			return;
		}
		if (p < 1 || p > 32) {
			alert(`Please check your input. A value other than a numbers in range 1-32 was found: ${p}.`);
			cancel = true;
		}
	});

	// if one wasn't, quit.
	if (cancel) {
		return;
	}

	// update each team stat with the input rank.
	// as well, set it's 'original' rank.
	TEAMS.forEach((t, index) => {
		let rank = parts[index];
		let team_stats = get_or_add_team_stats(t.id);
		team_stats.rank = team_stats.originalRank = rank;
	});

	// re-sort the items: grab and remove all the elements,
	// then re-attach them in order.
	let teams_root_ele = $(TEAMS_ELEMENT_SELECTOR);
	let teams_eles = teams_root_ele.children(`[${DATA_TEAM_ID_ATTR}]`).detach();

	Array.from(STATS.values()).sort(by_original_rank).forEach(stat => {
		console.log(`appending ${stat.id} (${stat.rank})`);
		teams_root_ele.append(stat.team.element);
	});

	// re-update each element's rank & delta rank display
	populate_rank_and_delta_display();
}

// helper that copies the text from the output textarea to the user's clipboard.
// bad: doesn't check for permission, etc. may fail on some platforms.
async function copy_output_to_clipboard(e) {
	await navigator.clipboard.writeText($(OUTPUT_TEXTAREA_SELECTOR).text);
}

// adds a listener to the input textarea to try to automatically load after a paste occurs.
function bind_input_paste_listener() {
	$(INPUT_TEXTAREA_SELECTOR).bind('paste', function(e) {
		// after 100ms, attempt to load what they pasted
		setTimeout(load_input_to_ranks, 100);
	});
}

// initialize everything once the document is ready
$(document).ready(() => {
	// disable ajax caching
	$.ajaxSetup({
		cache: false,
	});

	// populate initial data
	let rank = 1;
	TEAMS.forEach(team => {
		let stat = get_or_add_team_stats(team.id);
		stat.team = team;
		stat.rank = stat.originalRank = rank;
		++rank;
	});

	// create the initial table layout
	create_table_headers();
	create_team_rows();

	// fill up the right sidebar textareas.
	fill_teams_textarea();
	fill_textarea_by_data(INPUT_TEXTAREA_SELECTOR);
	fill_textarea_by_data(OUTPUT_TEXTAREA_SELECTOR);

	bind_input_paste_listener();

	// fetch data and populate table with stats!
	$.getJSON('./data/full.json', on_data_fetched);
});