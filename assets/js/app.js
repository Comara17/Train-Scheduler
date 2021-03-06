$(document).ready(function () {
// Initialize Firebase
	var config = {
		apiKey: "AIzaSyDkdC_EPwtZocKqe08XazuQTv_8piKCkQo",
		authDomain: "train-scheduler-3aa08.firebaseapp.com",
		databaseURL: "https://train-scheduler-3aa08.firebaseio.com",
		projectId: "train-scheduler-3aa08",
		storageBucket: "train-scheduler-3aa08.appspot.com",
		messagingSenderId: "279974022472"
	};
	firebase.initializeApp(config);

	var database = firebase.database();

	//Add form data to Firebase when "submit" is clicked
	$("#add-train").click(function () {

		event.preventDefault();

		var name = $("#name-input").val().trim();
		var destination = $("#destination-input").val().trim();
		var time = $("#first-train-time-input").val().trim();
		var frequency = $("#frequency-input").val().trim();

		database.ref().push({
		name: name,
		dest: destination,
		time: time,
		freq: frequency,
		});
	//Reset forms
		$("input").val('');

	});
	//When an objet child is pushed to the database this function is called
	database.ref().on("child_added", function(childSnapshot) {
		//Set our working variables to the last child object added to the database
		var name = childSnapshot.val().name;
		var destination = childSnapshot.val().dest;
		var time = childSnapshot.val().time;
		var frequency = childSnapshot.val().freq;
		//Parse the frequency into an integer
		var frequency = parseInt(frequency);
		//Moment is a function from jsdeliver that gets the current time
		var currentTime = moment();
		//Subtract a year from the moment object to get hour and minute
		var timeFormat = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');

		var trainTime = moment(timeFormat).format('HH:mm');

		var timeConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');

		var timeDifference = moment().diff(moment(timeConverted), 'minutes');

		var timeRemainder = timeDifference % frequency;

		var minsAway = frequency - timeRemainder;

		var nextTrain = moment().add(minsAway, 'minutes');
		//Append data to the proper tables
		$('#currentTime').text(currentTime);
		$('#trainTable').append(
				"<tr><td>" + childSnapshot.val().name +
				"</td><td>" + childSnapshot.val().dest +
				"</td><td>" + childSnapshot.val().freq +
				"</td><td>" + moment(nextTrain).format("HH:mm") +
				"</td><td>" + minsAway  + ' minutes until arrival' + "</td></tr>");
	},
		function(errorObject) { 
		console.log("Read failed: " + errorObject.code);

	});

});


	





