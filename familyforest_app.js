// declare collections
// this code should be included in both the client and the server
Persons = new Meteor.Collection("persons"); // can have relations (adopted) and marriages
NameChanges = new Meteor.Collection("namechanges");
References = new Meteor.Collection("references"); // genealogical research links
Marriages = new Meteor.Collection("marriages"); // person -person and can have children
Relations = new Meteor.Collection("relations"); // parent child relationships
MediaItems = new Meteor.Collection("mediaitems"); // media captured make taggable to persons location  date, description
/* 
Persons.attachSchema(new SimpleSchema({
  suffix: {
    type: String,
    label: "Suffix",
    max: 20
  },
  nameFirstBirth: {
    type: String,
    label: "First Name at Birth"
  },
  nameLastBirth: {
    type: String,
    label: "Last Name at Birth"
  },
  dateBirth: {
    type: Date,
    label: "Date of Birth",
    optional: true
  },
  dateDeath: {
    type: Date,
    label: "Date of Death",
    optional: true
  },
  bio: {
    type: String,
    label: "Brief Bio",
    optional: true,
    max: 5000
  },
  isFemale: {
    type: Boolean,
    label: "Woman?"
  }
}));
Marriages.attachSchema(new SimpleSchema({
  spouse1Id: {
    type: String,
    label: "Spouse 1"
  },
  spouse2Id: {
    type: String,
    label: "Spouse 2"
  },
  dateMarried: {
    type: Date,
    label: "Date of Marriage",
    optional: true
  },
  dateDivorced: {
    type: Date,
    label: "Date of Divorce",
    optional: true
  },
  location: {
    type: String,
    label: "Where did it begin"
  }
}));
Relations.attachSchema(new SimpleSchema({
  
  parentId: {
    type: String,
    label: "Spouse 1"
  },
  childId: {
    type: String,
    label: "Spouse 2"
  },
  parentType: {
    type: String,
    label: "person or marriage"
  },
  isAdopted: {
    type: Boolean,
    label: "Adopted?"
  }
}));
References.attachSchema(new SimpleSchema({
  
  personId: {
    type: String,
    label: "Person"
  },
  refType: {
    type: String,
    label: "Type of Reference(birth!death!marriage...)"
  },
  page: {
    type: String,
    label: "from gedcom file"
  },
  location: {
    type: Boolean,
    label: "note field from gedcom file"
  },
  extractText: {
    type: String,
    label: "contents of reference",
    max: 5000
  }
}));
*/
// server: populate collections with some initial documents
// Rooms.insert({name: "Conference Room A"});
// Persons: isFemale, nameFull, nameFirstBirth, placeBirth, placeDeath,  nameLastBirth, suffix, bio, dateBirth, dateDeath, personId
// References: personId, refType (birth|death|etc), page from gedcom, location=note from gedcom, extractText 
// Relations: relationType (child|adopted), parentId,parentType, childId
// Marriages: dateMarried, dateDivorce, spouse1Id, spouse2Id
// var allPersons = Persons.find(sort=["nameLastBirth","nameFirstBirth"]).fetch();
// Messages.insert({text: "Hello world", room: myRooms[0]._id});
// Parties.insert({name: "Super Bowl Party"});
if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);
  // account sign-in configuration
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });

  if (Accounts._resetPasswordToken) {
    Session.set('resetPassword', Accounts._resetPasswordToken);
  } 

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });
/*
  // trim helper
  var trimInput = function(val) {
    return val.replace(/^\s*|\s*$/g, "");
  }

  var isValidPassword = function(val) {
     return val.length >= 6 ? true : false; 
  }

  Template.login.events({

    'submit #login-form' : function(e, t){
      e.preventDefault();
      // retrieve the input field values
      var email = t.find('#login-email').value;
      var password = t.find('#login-password').value;

        // Trim and validate your fields here.... 

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
      Meteor.loginWithPassword(email, password, function(err){
        if (err){
          // The user might not have been found, or their passwword
          // could be incorrect. Inform the user that their
          // login attempt has failed. 
        }else{
          // The user has been logged in.
        }
      });
      return false; 
    }
  });
  Template.register.events({
    'submit #register-form' : function(e, t) {
      e.preventDefault();
      var email = t.find('#account-email').value;
      var password = t.find('#account-password').value;

        // Trim and validate the input

      Accounts.createUser({email: email, password : password}, function(err){
          if (err) {
            // Inform the user that account creation failed
          } else {
            // Success. Account has been created and the user
            // has logged in successfully. 
          }

        });

      return false;
    }
  });
  Template.passwordRecovery.events({

      'submit #recovery-form' : function(e, t) {
        e.preventDefault();
        var email = trimInput(t.find('#recovery-email').value);

        if (isNotEmpty(email) && isEmail(email)) {
          Session.set('loading', true);
          Accounts.forgotPassword({email: email}, function(err){
          if (err)
            Session.set('displayMessage', 'Password Reset Error &amp; Doh')
          else {
            Session.set('displayMessage', 'Email Sent &amp; Please check your email.')
          }
          Session.set('loading', false);
        });
        }
        return false; 
      },

      'submit #new-password' : function(e, t) {
        e.preventDefault();
        var pw = t.find('#new-password-password').value;
        if (isNotEmpty(pw) && isValidPassword(pw)) {
          Session.set('loading', true);
          Accounts.resetPassword(Session.get('resetPassword'), pw, function(err){
            if (err)
              Session.set('displayMessage', 'Password Reset Error &amp; Sorry');
            else {
              Session.set('resetPassword', null);
            }
            Session.set('loading', false);
          });
        }
      return false; 
      }
  });
*/
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish("person", function (personId) {
    check(personId, String);
    return Persons.find({ _id: personId});
  });
  Meteor.publish("person-marriages", function (personId) {
    check(personId, String);
    return Marriages.find({$or: [{spouse1Id: personId},{spouse2Id: personId}]}).fetch();
  });
  Meteor.publish("person-children-rel", function (personId) {
    check(personId, String);
    return Relations.find({parentId: personId, parentType: "person"}).fetch();
  });
  Meteor.publish("person-parent-rel", function (personId) {
    check(personId, String);
    return Relations.find({childId: personId}).fetch(); // one or more person or marriages
  });
  Meteor.publish("marriage-children-rel", function (marriageId) {
    check(marriageId, String);
    return Relations.find({parentId: marriageId, parentType: "marriage"}).fetch();
  });
  Meteor.publish("person-add", function (person) {
    check(person, {isFemale: Boolean,  nameFirstBirth: String, placeBirth: String, placeDeath: String,  nameLastBirth: String,  nameSuffixBirth: String, nameSuffixBirthLast: String, bio: String, dateBirth: Date, dateDeath: Date });
    return Persons.insert(person);
  });
  Meteor.publish("marriage-add", function (marriage) {
    check(marriage, { spouse1Id: String, spouse2Id: String, dateMarried: Date, dateDivorced: Date, location: String});
    return Marriages.insert(marriage);
  });
  Meteor.publish("relation-add", function (relation) {
    check(relation, {parentId: String, childId: String, parentType: String,  isAdopted: Boolean});
    return Relations.insert(relation);
  });
  Persons.allow({
    insert: function (userId, person) {
      return currentUser?true:false;
    }
  });
  Marriages.allow({
    insert: function (userId, marriage) {
      return currentUser?true:false;
    }
  });
  Relations.allow({
    insert: function (userId, party) {
      return currentUser?true:false;
    }
  });



}
