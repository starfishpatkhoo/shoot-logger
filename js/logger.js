/*!
 *
 *** Copyright (c) 2023 Patrick Khoo @ https://deepwave.net ***
 *
 */
var start_dts = null,  // DTS of Recording Start
	take_dts = null,  // DTS of Take Start
	rec_counter = 0,  // File No (no of Recordings started)
	take_counter_list = [],  // List of Takes in this Recording
	take_counter_secs = 0,  // Total no of Seconds of all Good Takes
	timer = null,  // Timer for Javascript
	fps = 50,  // Frames per Second
	mspf = 1000 / fps,  // Miliseconds per Frame
	id_disp_main, id_disp_take, id_disp_takes, id_disp_take_log,
	id_btn_camera, id_btn_take, id_btn_discard, id_btn_takes, id_btn_copy, id_btn_fps, id_btn_help,
	id_rec_no, id_take_no, id_take_comment, id_beep_audio;
var session_start_str = null;
var camera_start_str = 'Roll Camera <span class="txt-tiny">[Q]</span>';
var camera_stop_str = 'Stop Camera <span class="txt-tiny">[Q]</span>';
var take_start_str = 'Action! <span class="txt-tiny">[M]</span>';
var take_stop_str = 'Good Take <span class="txt-tiny">[M]</span>';
var copy_icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
var copy_ok = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>';

// Update Display, Called At Every Interval
function display_update() {
	id_disp_main.innerHTML = get_timer_string();  // Display Main Timer
	id_disp_take.innerHTML = get_timer_string(take_dts);  // Display Take Timer
}

// Start / Stop Camera Rolling
// Do we need a button to force reset the Camera? Probably not, just start rolling again, or reload the page
function camera_toggle() {
	if (null === start_dts) {  // Roll Camera
		clearInterval(timer);
		timer = setInterval(display_update, mspf);  // Call Display Function every Frame
		if (null === session_start_str) { session_start_str = get_dts(); }  // Save the Session Start DTS if this is the first time we are rolling the camera
		rec_counter++;
		take_counter_secs = 0;
		take_counter_list[(rec_counter-1)] = 0;
		start_dts = new Date();
		display_update();
		id_disp_main.classList.add("txt-contrast");
		// id_disp_takes.innerHTML = "";  // Clear Take Log
		id_btn_camera.innerHTML = camera_stop_str;
		id_btn_camera.classList.add('contrast');
		id_btn_take.disabled = false;  // Enable the Take Start/Stop Button
		id_btn_fps.disabled = true;  // Don't allow changing the FPS while the Camera is Rolling
	} else {  // Stop Camera
		clearInterval(timer);  // Stop the Timer
		take_stop(true);  // If any Take is Rolling, Assume it's a Good One
		display_update();
		if (1 > take_counter_list[(rec_counter-1)]) {  // Ignore this entire recording because there are no takes in it
			rec_counter--;
			take_counter_list.pop();
		} else {
			camera_stop_log();  // Update the Shot Logger with the totals
		}
		start_dts = null;
		take_dts = null;
		id_disp_main.classList.remove("txt-contrast");
		id_btn_camera.innerHTML = camera_start_str;
		id_btn_camera.classList.remove('contrast');
		id_btn_take.disabled = true;  // Disable the Take Start/Stop Button
		id_btn_fps.disabled = false;  // Re-enable the FPS Selection
	}
}

// Finish a Take and if it is a Good Take, Add it to the Take Log
function camera_stop_log() {
	id_disp_takes.innerHTML += "<tr>" +
		"<td class='txt-right' colspan='2'>Total Recording / Take Duration:</td>" +
		"<td class='txt-center'>" + id_disp_main.innerHTML + "</td>" +
		"<td class='txt-center'>" + get_timer_string(0, take_counter_secs) + "</td>" +
		"<td colspan='2'><span></span></td>" +
		"</tr>";
}

// Start / Stop a New Take
function take_toggle() {
	if (null === start_dts) { return; }  // Camera Not Rolling
	if (null === take_dts) {  // Start a New Take
		take_dts = new Date();
		id_disp_take.classList.add("txt-contrast");
		id_btn_take.innerHTML = take_stop_str;
		id_btn_take.classList.add('contrast');
		// Enable the Take Discard Button
		id_btn_discard.classList.add('secondary');
		id_btn_discard.disabled = false;
		play_beep();
	} else {  // Stop The Current Take as a Good Take
		take_stop(true);
	}
}

// Finish a Take and if it is a Good Take, Add it to the Take Log
function take_stop(isgood = false) {
	if (null === take_dts) { return; }  // No Take In Progress
	if (isgood) {
		now = new Date();
		take_counter_secs = take_counter_secs + (now - take_dts);
		take_counter_list[(rec_counter-1)]++;
		takeno = take_counter_list[(rec_counter-1)];
		id_disp_takes.innerHTML += "<tr id='take-" + rec_counter + "-" + takeno + "'>" +
			"<td class='txt-center'>" + rec_counter + "</td>" +
			"<td class='txt-center'>" + takeno + "</td>" +
			"<td class='txt-center'>" + get_timer_string(start_dts, take_dts) + "</td>" +
			"<td class='txt-center'>" + get_timer_string(start_dts, now) + "</td>" +
			"<td class='txt-center'>" + get_timer_string(take_dts, now) + "</td>" +
			"<td><span id='take-cmt-" + rec_counter + "-" + takeno + "'></span></td>" +
			"</tr>";
	}
	take_dts = null;
	id_disp_take.classList.remove("txt-contrast");
	id_btn_take.innerHTML = take_start_str;
	id_btn_take.classList.remove('contrast');
	id_btn_discard.classList.remove('secondary');
	id_btn_discard.disabled = true;  // Disable the Take Discard Button
	play_beep();
}

// Check if Take Log is Open
function log_is_open() {
	return (id_btn_takes.open) ? true : false;
}

// Open Take Log Listing
function log_open() {
	if (! log_is_open()) { id_btn_takes.open = true; }  // Take Log is Closed, Open It
	id_take_no.focus();  // Focus on the Take No Box
}

// Close Take Log Listing
function log_close() {
	defocus();  // Defocus
	if (log_is_open()) { id_btn_takes.open = false; }  // Take Log is Open, Close It
}

// Copy Take Log - This only works if the element is visible in the first place (Take Log is Open)
function log_copy() {
	var start_str = "";
	if (null !== session_start_str) { 
		start_str = "Session Start: " + session_start_str + "\n";
		end_str = "Session End:   " + get_dts() + "\n\n";
	} else {
		start_str = "Session Start: N/A\n";
		end_str = "Session End:   N/A\n\n";
	}
	navigator.clipboard.writeText(start_str + end_str + id_disp_take_log.innerText + "\n").then(() => {
		// Copy to Clipboard Successful
		id_btn_copy.innerHTML = copy_ok;
		setTimeout(function() { id_btn_copy.innerHTML = copy_icon; }, 5000);  // Clear the OK Message
	},() => {
		// Failed to Copy to Clipboard (No Permissions?)
		console.error('Copy Take Log to Clipboard Failed');
	});
}

// Load a Comment
function load_comment() {
	id_take_comment.focus();  // Focus on the Take Comment Box (no matter if we loaded a comment or not)
	recno = parseInt(id_rec_no.value) || 0;
	if ((recno < 1) || (recno > take_counter_list.length)) { recno = rec_counter; }  // This recording does not exist - Assume Current Recording
	takeno = parseInt(id_take_no.value) || 0;
	if ((takeno < 1) || (takeno > take_counter_list[(recno-1)])) { return; }  // This take does not exist
	// Take (<tr>) ID is take-#, and Comment (<span>) ID is take-cmd-#
	cur_comment = document.getElementById("take-cmt-" + recno + '-' + takeno).innerText;
	if (cur_comment.length > 0) { id_take_comment.value = cur_comment; }  // Load the Existing Comment if therfe is one
}

// Save a Comment
function save_comment() {
	recno = parseInt(id_rec_no.value) || 0;
	if ((recno < 1) || (recno > take_counter_list.length)) { recno = rec_counter; }  // This recording does not exist - Assume Current Recording
	takeno = parseInt(id_take_no.value) || 0;
	if ((takeno < 1) || (takeno > take_counter_list[(recno-1)])) { return; }  // This take does not exist
	// Take (<p>) ID is take-#, and Comment (<span>) ID is take-cmd-#
	document.getElementById("take-cmt-" + recno + '-' + takeno).innerText = id_take_comment.value;
	clear_comment();
	id_take_no.focus();  // Focus on the Take No Box
}

// Clear Comment Box
function clear_comment() {
	id_take_no.value = "";
	id_take_comment.value = "";
}

// Support Function - Update FPS
function update_fps() {
	if (2 > fps) {
		mspf = 1000;  // No Frames
	} else {
		mspf = 1000 / fps;  // Miliseconds per Frame
	}
	display_update();
}

// Toggle Displaying Help Box
function help_toggle() {
	if (id_btn_help.open) {
		id_btn_help.open = false;
	} else {
		id_btn_help.open = true;
	}
}

// Support Function - Convert from Date to Human Readable Elapsed Time
function get_timer_string(start_date_var = start_dts, end_date_var = new Date()) {
	if ((null === start_date_var) || (null === end_date_var)) {
		// No Timer In Progress
		if (2 > fps) { return "00:00:00"; }  // No frames
		if (99 < fps) { return "00:00:00:000"; }
		return "00:00:00:00";
	}
	elapsed = end_date_var - start_date_var; // Elapsed time in milliseconds
	hours = Math.floor(elapsed / 3600000);  // 1000 * 60 * 60 = 1 hour
	elapsed = elapsed % 3600000;
	minutes = Math.floor(elapsed / 60000);  // 1000 * 60 = 1 minute
	elapsed = elapsed % 60000;
	seconds = Math.floor(elapsed / 1000);  // 1000 = 1 second
	cur_str = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
	if (2 > fps) { return cur_str; }  // No frames
	miliseconds = elapsed % 1000;  // Miliseconds
	frames = Math.floor(miliseconds / mspf);  // Frames
	if (99 < fps) {
		return cur_str + ":" + pad(frames, 3);
	} else {
		return cur_str + ":" + pad(frames);
	}
}

// Support Function - Pad Zeros
// function pad(num, size) {
// 	num = num.toString();
// 	while (num.length < size) num = "0" + num;
// 	return num;
// }
function pad(num, size = 2) {
	var str = "000000000" + num;  // Maximum 10 digits
	if (size < 10) {
		return str.substring(str.length - size);
	} else {
		return str;
	}
}

// Support Function - Get Current Date + Time String
function get_dts() {
	var now = new Date();
	var hours = now.getHours();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12;  // 0 Hour should be 12
	var time_str = hours + ':' + pad(now.getMinutes()) + ":" + pad(now.getSeconds()) + ' ' + ampm;
	return time_str + ", " + now.toDateString();
}

// Support Function - Remove focus from the current UI element
function defocus() {
	// window.focus();  // Focus on Window (We should already be focused on the Window)
	if (document.activeElement) { document.activeElement.blur(); }  // Remove Focus from The Current Active Element
}

// Support Function - Play the Beep Sound
function play_beep() {
	id_beep_audio.play();
}

// Window Load Initialisation
window.onload = function () {

	// Global IDs
	id_disp_main =		document.getElementById("disp-main");
	id_disp_take =		document.getElementById("disp-take");
	id_disp_takes =		document.getElementById("disp-takes");
	id_disp_take_log =	document.getElementById("disp-take-log");
	id_btn_camera =		document.getElementById("btn-camera");
	id_btn_take =		document.getElementById("btn-take");
	id_btn_discard =	document.getElementById("btn-discard");
	id_btn_takes =		document.getElementById("btn-takes");
	id_btn_copy =		document.getElementById("btn-copy");
	id_btn_fps =		document.getElementById("btn-fps");
	id_btn_help =		document.getElementById("btn-help");
	id_rec_no =			document.getElementById("rec-no");
	id_take_no =		document.getElementById("take-no");
	id_take_comment =	document.getElementById("take-comment");
	id_beep_audio =		document.getElementById("beep-audio");

	// Button Handlers
	id_btn_camera.innerHTML = camera_start_str;
	id_btn_take.innerHTML = take_start_str;
	id_btn_camera.onclick = function() { camera_toggle(); }
	id_btn_take.onclick = function() { take_toggle(); }
	id_btn_discard.onclick = function() { take_stop(); }
	id_btn_copy.onclick = function() { log_copy(); }
	id_btn_fps.onchange = function() { fps = id_btn_fps.value; update_fps(); }

	// Keyboard Event Listener
	document.addEventListener('keydown', function(event) {
		// We use event.key instead of event.code because .key is keyboard layout independant, but .code is the physical key position on the keyboard
		// Example: (event.key == 'Enter') vs ((event.code == 'Enter') && (event.code == 'NumpadEnter'))
		if (log_is_open() && ('Escape' == event.key)) { event.preventDefault(); log_close(); return; }  // Catch all ESC to close Take Log if it is Open
		if (event.target.id == "take-comment") {  // We're inside the Take Comment Box
			if ('Enter' == event.key) { event.preventDefault(); save_comment(); return; }
			return;   // Don't Catch any other Key-Presses in the Take-Comment Box
		}
		if (event.target.id == "take-no") {  // We're inside the Take No Box
			if (('Enter' == event.key) || ('Tab' == event.key)) { event.preventDefault(); load_comment(); return; }
		}
		// if (event.target.tagName === 'INPUT') { return; }  // Skip any INPUT tags we may be pressed on
		if (('Q' == event.key) || ('q' == event.key)) { event.preventDefault(); camera_toggle(); return; }
		if (('M' == event.key) || ('m' == event.key)) { event.preventDefault(); take_toggle(); return; }
		if (('X' == event.key) || ('x' == event.key)) { event.preventDefault(); take_stop(); return; }
		if (('L' == event.key) || ('l' == event.key)) { event.preventDefault(); log_open(); return; }
		if (('H' == event.key) || ('h' == event.key)) { event.preventDefault(); help_toggle(); return; }
		if ((event.ctrlKey) && (('C' == event.key) || ('c' == event.key))) { event.preventDefault(); log_copy(); return; }
	});

	// Initialize
	update_fps();
	display_update();
	id_btn_copy.innerHTML = copy_icon;
}
