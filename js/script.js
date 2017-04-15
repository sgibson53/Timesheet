moment().format('MM/DD/YYYY');
var config = {
    apiKey: "AIzaSyCmaYD3e0seDuycPClEpS-fVbbpNevZHew",
    authDomain: "timesheet-a7050.firebaseapp.com",
    databaseURL: "https://timesheet-a7050.firebaseio.com",
    projectId: "timesheet-a7050",
    storageBucket: "timesheet-a7050.appspot.com",
    messagingSenderId: "507138517293"
  };

var db = firebase.initializeApp(config).database();

var name, role, startDate, monthlyRate;
var user = "user_";

$('#submit-form').submit(function(e) {
     e.preventDefault();

     var id;
     name = $('#name').val().trim();
     role = $('#role').val().trim();
     startDate = $('#start-date').val().trim();
     monthlyRate = $('#monthly-rate').val().trim();

     // Check formats
     if (!moment(startDate, "MM/DD/YYYY").isValid()) {
         alert("Date format invalid!");
         return;
     }
     if (isNaN(monthlyRate)) {
         alert("Invalid monthly rate!");
         return;
     }

     db.ref('numUsers').once('value').then(function(res) {
         id = res.val();

         // append the data
         var userRef = db.ref().child('/users/');
         userRef.child(user+id).set({
             name: name,
            role: role,
            startDate: moment(startDate, "MM/DD/YYYY").format('MM/DD/YYYY'),
            monthlyRate: monthlyRate,
            timeStamp: Date.now()
         })

         id++;
         db.ref('numUsers').set(id);

     });
})

db.ref().on('value', function(snapshot) {

    $('#table-body').html(
        "<tr>"+
            "<th>Name</th>"+
            "<th>Role</th>"+
            "<th>Start Date</th>"+
            "<th>Months Worked</th>"+
            "<th>Monthly Rate</th>"+
        "</tr>"
    );
    
    for (var o in snapshot.val().users) {
        var el = snapshot.val().users[o];
        var data = "<tr>";
        data += "<td>"+el.name+"</td>"+
                "<td>"+el.role+"</td>"+
                "<td>"+el.startDate+"</td>"+
                "<td>"+moment().diff(moment(el.startDate, "MM/DD/YYYY"), 'months')+"</td>"+
                "<td>$"+el.monthlyRate+"</td>";
        data += "</tr>";
        $('#table-body').append(data);
    }
    

    
});