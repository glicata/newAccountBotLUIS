/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add 
natural language support to a bot. 
For a complete walkthrough of creating this type of bot see the article at
http://docs.botframework.com/builder/node/guides/understanding-natural-language/
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});
 
var bot = new builder.UniversalBot(connector);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] }) // no semicolon(;) required here
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
//var accountType, accountLevel, typeOfPersonalAccount, typeOfBusinessAccount;
//var account = {};
//var firstName, lastName, question, order, city;
var entFirstName;
var person = {};

var conversationRules = {
                "rule":

               [
                    {
                        order: "1",
                        entity: "firstName",
                        question: "What is your first name?"                        
                    },

                    {
                        order: "2",
                        entity: "lastName",
                        question: "What is your last name?"
                    },
                    {
                        order: "3",
                        entity: "cityName",
                        question: "What city do you live in?"
                    }
               ]
            }; // end of conversation rules JSON

intents.matches('name', [

   // console.log('new account'),
    function (session, args, next)
    {
      //  entFirstName = builder.EntityRecognizer.findEntity(args.entities, 'firstName');
        
      /*  person = {
            entFirstName: entFirstName ? entFirstName.entity : null
        }
        */
    //    conversationRules.rule[0].entity = person.entFirstName;
   //     session.send("the first name is " + conversationRules.rule[0].entity);
       console.log('begin session');
       //var rule = conversationRules.rule[1];
       session.beginDialog("/askQuestion", 0);
    }
 
]); // end of new account intent

bot.dialog('/askQuestion', [

    function (session, args)
    {
        var question = conversationRules.rule[args].question;
        builder.Prompts.text(session, 'question = ' + question);
        session.send('after question');
       //var getEntity = conversationRules.rule[args].entity;


        if (args < conversationRules.rule.length - 1) // no array index out of bounds 
        {
           // if (args < conversationRules.rule.length - 1) {
                session.beginDialog("/askQuestion", args + 1);
          //  }
            
        }
        
    },

    function (session, results)
    {
        session.userData.name = results.response;
        session.endDialog();
    }
]);


        /*
        
        var conversationRules = {
                "rule":

               [
                    {
                        "order": "1",
                        "entity": "firstName",
                        "question": "What is your first name?"                        
                    },
                    {
                        "order": "2",
                        "entity": "lastName",
                        "question": "What is your last name?"
                    },
                    {
                        "order": "3",
                        "entity": "cityName",
                        "question": "What city do you live in?"
                    },
               ]
            }; // end of conversation rules JSON
        */
       
    
   
    
// THE END OF THE INITIAL INTENTS.MATCHES THAT YOU MOVED UP FOR READABILITY 


	// let set known entities using a scalable slot bases approach.
	 // acts like the set known entities value  

	/* setKnownEntities =  function (session, args, next)
	{
		
		 accountType = builder.EntityRecognizer.findEntity(args.entities, 'accountType');
         accountLevel = builder.EntityRecognizer.findEntity(args.entities, 'accountLevel');
         typeOfPersonalAccount = builder.EntityRecognizer.findEntity(args.entities, 'accountType::typeOfPersonalAccount');
         typeOfBusinessAccount = builder.EntityRecognizer.findEntity(args.entities, 'accountType::typeOfBusinessAccount');
		
	
	knownEntities = {
				accountType: accountType ? accountType.entity : null,
				accountLevel: accountLevel ? accountLevel.entity : null,
				typeOfPersonalAccount: typeOfPersonalAccount ? typeOfPersonalAccount.entity : null,
				typeOfBusinessAccount: typeOfBusinessAccount ? typeOfBusinessAccount.entity : null
			} 

    session.send('accountType = ' + knownEntities.accountType + ' account level = ' + knownEntities.accountLevel);

        //use a switch here to set the known entities ?

    setKnownEntities = function (entity) {

        switch (entity) {
            case ' ':
                knownEntities = { "entities": [] };
                break;
            case 'premium':
                knownEntities = { "entities": [{ "entityName": "accountLevel", "entityValue": "Premium" }] };
                break;
            case 'basic':
                knownEntities = { "entities": [{ "entityName": "accountLevel", "entityValue": "Basic" }] };
                break;
            case 'business':
                knownEntities = { "entities": [{ "entityName": "accountType", "entityValue": "Business" }] };
                break;
            case 'personal':
                knownEntities = { "entities": [{ "entityName": "accountType", "entityValue": "personal" }] };
                break;
            default:
                session.send("Unknown Option");
        }
    }

    },

	
		setConversationRules = function() {
		
		conversationRules = {"rule":
		[
		{"order":"1", "entity":"accountType", "question":"What type of account did you want to set up?", "responseOptions":[{"response":"Business"}, {"response":"personal"}]},
		{"order": "2", "entity": "accountLevel", "question": "What account level do you want to set up?", "responseOptions": [{ "response": "Basic" }, { "response": "Premium" }] },
        { "order": "3", "entity": "typeOfBusinessAccount", "question": "What type of business do you have? ", "responseOptions": [{ "response": "LLC" }, { "response": "Sole Proprietorship ", }], "dependsOnEntity": { "entityName": "accountType", "entityValue": "Business" } },
        { "order": "4", "entity": "typeOfPersonalAccount", "question": "What type of personal account are you setting up? ", "responseOptions": [{ "response": "Individual " }, { "response": "Joint" }], "dependsOnEntity": { "entityName": "accountType", "entityValue": "Personal" } },
		
		]};
		
	} //end of setConversationRules function

       
	
	// end of setKnownEntities  - Initial bot session
	*/





   /* 
    function (session, args, next) 
	{
			
			//saving the entities that are passed to the user in the first dialog with the bot
         accountType = builder.EntityRecognizer.findEntity(args.entities, 'accountType');
         accountLevel = builder.EntityRecognizer.findEntity(args.entities, 'accountLevel');
         typeOfPersonalAccount = builder.EntityRecognizer.findEntity(args.entities, 'accountType::typeOfPersonalAccount');
         typeOfBusinessAccount = builder.EntityRecognizer.findEntity(args.entities, 'accountType::typeOfBusinessAccount');
		
        console.log('ENTITIES', accountType, accountLevel, typeOfPersonalAccount, typeOfBusinessAccount);
		
         account = 
						{
							accountType: accountType ? accountType.entity : null,
							accountLevel: accountLevel ? accountLevel.entity : null,
							typeOfPersonalAccount: typeOfPersonalAccount ? typeOfPersonalAccount.entity : null,
							typeOfBusinessAccount: typeOfBusinessAccount ? typeOfBusinessAccount.entity : null
						}

		session.send('This is the new account intent' + JSON.stringify(args));
        /*
		 if(!account.accountType)
         {
             session.send('Account Type IF');
             next();
			 
		 }
        */
		/*
        next();
       
    },// end of function

    function (session, args, next) {
        session.send('Function to begin accountType dialog');
        if (!account.accountType)
        {
            session.beginDialog('accountType');
        }
        else if (!account.accountLevel) {
            session.beginDialog('accountLevel');
        }
        else
        {
            next();
        }
    },
    function (session, results, next)
    {
        if (results.response)
        {
            // account.accountType = results.entity.response;
            session.send('Your response was: ' + results.response);
        }
        else
        {
            next();
        }
    }
  */
 


bot.dialog('accountType', [

    function (session) 
	{
        builder.Prompts.text(session, "Is this for a business account or personal account.");
    },
	
	function (session, results)
	{
			
			//session.send('Your response was %s' , results.response);
			//Bot does not like following lines of code. 
			//account.accountLevel = builder.EntityRecognizer.findEntity(results.entities, 'accountType');
			//accout.accountType = restuls.response.entity
			
			// send this entity back to the main conversation?
			
			session.endDialogWithResult(results);
	}
    

]); 

bot.dialog ('accountLevel', [


function (session) {
builder.Prompts.text(session, "Would you like to open a basic or premium account?");
},
function (session, results){
	//session.send('Your response was %s', results.response);
	session.endDialogWithResult(results);
}

]);
	
	



intents.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});

bot.dialog('/', intents);    

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}

