<?php

	require_once('main.php');

	try	{
		$app = new Main();
		$app->run();
	} catch (Exception $e) {
		echo "Error: {$e->getMessage()}";
		die;
	}

	$now = strtotime('now');
	$ver = "v={$app->getVersionShort()}";
?>

<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<title>Rank Jags #1 kthx</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="manifest" href="site.webmanifest">
	<link rel="apple-touch-icon" href="icon.png">

	<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>

	<link href="main.css?<?= $ver ?>" rel="stylesheet">
	<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

	<meta name="theme-color" content="#fafafa">
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js" integrity="sha384-6khuMg9gaYr5AxOqhkVIODVIvm9ynTT5J4V1cfthmT+emCG6yVmEZsRHdxlotUnm" crossorigin="anonymous"></script>

	<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/html5sortable/0.13.3/html5sortable.min.js" integrity="sha512-3btxfhQfasdVcv1dKYZph5P7jFeeLRcF1gDVzFA+k9AiwwhB1MNI7O58zCK0uVItuMHNDR5pMoF2nqlCGzUwZQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

	<script src="main.js?<?= $ver ?>"></script>
</head>

<body class="body">
	<div class="spacer"></div>
	<div class="main-container">
		<div class="main main-flex">
			<div class="main-item tool">
				<div class="rank-table">
					<h5>NFLPR Sort'em! <span class="week-status">Week <?= $app->getCurrentWeek() ?> (<?= $app->getCurrentWeekState() ?>)</span></h5>
					<table id="the-league" data-live-week="<?= $app->getCurrentWeek() ?>" data-now="<?= $now ?>">
						<thead>
							<tr></tr>
						</thead>
						<tbody class="table-spacer">
							<tr disabled></tr>
						</tbody>
						<tbody id="teams">
						</tbody>
					</table>
					<div class="data-age">
						Data updated: <?= $app->getDataLastModifiedDate() ?>
					</div>
					<div class="app-version">
						<?= $app->getVersion() ?>
					</div>
					<div class="source-links">
						Found a bug? Please <a href="https://github.com/nitz/nflrank/issues/new/choose" target="_blank">report it</a>!
					</div>
				</div>
			</div>
			<div class="main-item sidebar">
				<div class="instructions">
					<h6>Instructions</h6>
					How to use this tool:
					<br><br>
					Optionally paste your latest rankings in the 'Input' column. It should auto load when you paste, but if it doesn't: press the load button underneath.
					<br><br>
					Drag and drop the team rows around until you're happy with your new order. This may or may not work on all devices, desktop is recommended.
					<br><br>
					Press the copy button or manually copy the your numbers from the output column, then paste them into your column on the spreadsheet. That should be cell <code><?= $app->getCurrentWeekCellName() ?></code> for week <?= $app->getCurrentWeek() ?>.
				</div>
				<div class="numbers">
					<div class="numbers-item input">
						<h6>Input</h6>
						<textarea id="numbers-input" name="input" rows="32" cols="1" autocomplete="off" onclick="this.select();"></textarea>
						<br>
						<button class="btn btn-secondary btn-sm" onclick="load_input_to_ranks();">Load</button>
					</div>
					<div class="numbers-item teams">
						<h6>&nbsp;</h6>
						<textarea id="numbers-teams" rows="32" cols="13" readonly autocomplete="off"></textarea>
						<br>
					</div>
					<div class="numbers-item output">
						<h6>Output</h6>
						<textarea id="numbers-output" name="output" rows="32" cols="1" autocomplete="off" onclick="this.select();"></textarea>
						<br>
						<button class="btn btn-primary btn-sm" onclick="copy_output_to_clipboard();">Copy</button>
					</div>
				</div>
				<div class="instructions">
					Based on the wonderful work of <a href="https://old.reddit.com/u/ander1dw">ander1dw</a>. This tool wouldn't exist without you!
					Styled similarly because nostalgia is a hell of a drug.
					<br><br>
					This tool is <a href="https://github.com/nitz/nflrank" target="_blank">open source</a>!
				</div>
			</div>
		</div>
	</div>
	<div class="spacer"></div>
</body>

<footer>

</footer>

</html>

<?
