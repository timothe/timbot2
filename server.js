var Botkit = require('botkit')
var os = require('os')

var accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
var verifyToken = process.env.FACEBOOK_VERIFY_TOKEN
var port = process.env.PORT

if (!accessToken) throw new Error('FACEBOOK_PAGE_ACCESS_TOKEN is required but missing')
if (!verifyToken) throw new Error('FACEBOOK_VERIFY_TOKEN is required but missing')
if (!port) throw new Error('PORT is required but missing')

var controller = Botkit.facebookbot({
  access_token: accessToken,
  verify_token: verifyToken
})

var bot = controller.spawn()

controller.setupWebserver(port, function (err, webserver) {
  if (err) return console.log(err)
  controller.createWebhookEndpoints(webserver, bot, function () {
    console.log('Ready Player 1')
  })
})

controller.hears(['hello'], 'message_received', function (bot, message) {
	controller.storage.users.get(message.user, function(err, user) {
        if (user && user.welcomed) {
	        if (user && user.name) {
	            bot.reply(message, 'Hello again ' + user.name + '...');
	        } else {
	            bot.reply(message, 'Hello again');
	        }
        } else {
            controller.storage.users.get(message.user, function(err, user) {
                if (!user) {
                    user = {
                        id: message.user,
                    };
                }
                user.welcomed = true;
	            controller.storage.users.save(user, function(err, id) {
	                bot.reply(message, 'Hi! I\'m Timbot. I\'m Tim\'s programmed alter-ego :) I\'m here to tell you more about him.')
	                bot.reply(message, 'What do you want to know?')
	            });
            });
        }
    });	
});

controller.hears(['his life', 'tim\'s life', 'his universe'], 'message_received', function (bot, message) {
	bot.reply(message, 'Wow that is broad... Can we be more precise? Experience, education, hobbies?...')
});

controller.hears(['his experience', 'tim\'s experience'], 'message_received', function (bot, message) {
	bot.reply(message, 'He worked 8 years in Paris in agencies and 2 years in London in tech companies.')
	bot.reply(message, {
		attachment: {
		  type: 'template',
		  payload: {
		    template_type: 'button',
		    text: 'Do you want to know more about his experience in...',
		    buttons: [
		      {
		        type: 'postback',
		        title: 'London',
		        payload: 'show_london'
		      },
		      {
		        type: 'postback',
		        title: 'Paris',
		        payload: 'show_paris'
		      }
		    ]
		  }
		}
	})

});


/*
    "EXPERIENCE": "He worked 8 years in PARIS in agencies and 2 years in LONDON in tech companies.",
    "PARIS": "Tim began his career in 2006 with 6 months of internship as a project manager at MRM Worldwide, then at TBWA from 2006 to 2008 as a Project Manager then Technical Project Manager, and ~1 year at OGILVY. He then became an entrepreneur and built MILKY end of 2009. The company was bought in 2011, he left the project and built MUSTANG, which he ran 'till 2014.",
    "LONDON": "He was hired by CRITEO in 2014 as a Senior Technical Solutions Engineer. In 2016 he left the company to be hired at SMARTFOCUS as a Presales Consultant.",
    "MRM" : "MRM Worldwide is part of the McCann Erickson ad agencies group. This division is specialized in CRM communication with Nestlé, Gemey and Opel as their key clients. Tim worked on Care, Mastercard, Gaz de France, and Eurofactor",
    "TBWA" : "TBWA interactive is part of the TBWA ad agencies group. This division is specialized in digital communication. The 1st year was focusing on project management, then he asked to switch to Technical Project Management. Tim did a lot of different things there: concept design, development, technical consulting... on great clients: ADIDAS, Arcelor Mittal, BNP Paribas, Michelin, McDonald’s, Amnesty, SNCF",
    "OGILVY" : "Ogilvy One is part of the Ogilvy ad agencies group. This department is specialized in digital communication, working closely with Ogilvy & Mather. Tim began as the sole Project Manager able to work on both Flash and PHP/HTML projects. He then switched to the coordination of technical efforts for IBM EMEA at the Ogilvy & Mather division to adapt US campaigns to the EMEA market",
    "MILKY" : "Web agency leading brands to perform successful online communication. The great Milky adventure began in 2009 with 3 other business partners. He was the Head of project management, also doing Business development and People Management. The key clients were: ADIDAS, L’Oréal, Bourjois (FR, UK, CA), Etam, Longchamp, Nivea, Sarenza, Warner Bros, EMI, Voyages SNCF. A company was interested in buying the agency in 2011. Tim decided to sell and go, while the partners and employees stayed.",
    "MUSTANG" : "After selling his MILKY shares to the buyer Tim immediately created Mustang Interactive, another web developement agency. Some clients followed him in the deal, and the company grew 'till 2014, when Tim decided to close it and move to LONDON",
    "CRITEO" : "Criteo helps advertisers generate more sales through personalized performance advertising at a global scale. Tim had a very busy time there, where he was analysing the feasibility of implementations of the products for new clients, work closely with the technical contacts to initiate and follow-up successful campaigns, advise on campaigns optimisation by building best practices together with local and global Technical Solutions teams, create, manage and advise for advertisers’ campaigns on: Desktop, Mobile web, In-App and Email, create, manage and debug publishers’ networks (RTA, RTB, Passback, Cookie targeting), building Vertica queries, working closely with the TS UK Tier 1 team manager to review and interview potential TS candidates and organise and take part of new team members’ training. Tim talked with people from some big name companies on a day-to-day basis: M&S EMEA, John Lewis, Debenhams EMEA, House of Fraser, Gap / Banana Republic, Hotels.com EMEA, Expedia EMEA, Hostel World WW, HomeAway WW, Monarch, Gumtree, Kijiji, EON",
    "SMARTFOCUS" : "SmartFocus enhances digital strategies for businesses with The Message Cloud, a powerful platform featuring big data-fuelled insights and enabling smart multi- channel campaigns. Tim is pretty new there but he already met all the expectations of this very different company and job. His role consists of teaming up with sales people and meeting clients in Europe (France, Belgium, Switzerland, UK) to demonstrate the abilities of the platform, create demo environments and dummy websites to contextualize the pitch according to the client’s needs, answer RFPs / RFIs with the help of the Professional Services team and support the new Presales team by building a knowledge base and core materials",

    "EDUCATION" : "He studied at the University of Toulon (France) and graduated with a Master’s Degree \"Internet and Multimedia Engineering\" in 2006. This curriculum is proposing a variety of classes about the professions around internet: Development, Design, Marketing, Law, etc. but also filming: Writing, Photography, Storyboard, Montage, etc. At the end of it the idea is to be ready to become a Project Manager",

    "HOBBIES" : "Tim is a fan of Internet in general, science and technology. He spends loads of time watching qualitative TV series or organising his next trip abroad. Sports-wise, he's regularly practicing Muay Thai after years of the a classic jogging / weight lifting routine. He's a big fan of cars and motorbikes too and got the chance to participate in some races in the past",

	"EMEA": "EMEA means Europe, Middle East and Africa. It was not supposed to be a keyword really :)",
	"EON": "EON is not a keyword, it's an energy company",
	"RFP": "Request For Proposal: a set of basic questions the supplier should answer to to ensure they are keen to answer the client's needs",
	"RFI": "Request For Information: a set of basic questions the supplier should answer to to ensure they are keen to answer the client's needs",
	"EMI": "EMI is not really a keyword",
	"ADIDAS": "ADIDAS is not really a keyword",
	"BNP": "Banque Nationale de Paris, but it's not really a keyword",
	"SNCF": "Société Nationale des Chemins de fer Français (the French rail company), but it's not really a keyword",
	"TS": "TS means Technical Solutions",
	"CRM": "Customer Relationship Management, but I thought you would know that?",

    "YOU SUCK": "I think you have me confused with Vacuum-bot.",
    "FUCK YOU": "Well that's not nice...",

    "TU PARLES FRANCAIS ?": "Oui bien sûr : café, croissant.",
*/

	
	

  
/*
  bot.reply(message, 'I want to show you something')
  bot.reply(message, {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: 'Which do you prefer',
        buttons: [
          {
            type: 'postback',
            title: 'Cats',
            payload: 'show_cat'
          },
          {
            type: 'postback',
            title: 'Dogs',
            payload: 'show_dog'
          }
        ]
      }
    }
  })
*/


controller.on('facebook_postback', function (bot, message) {
  switch (message.payload) {
    case 'show_cat':
      bot.reply(message, {
        attachment: {
          type: 'image',
          payload: {
            url: 'https://media.giphy.com/media/5xaOcLT4VhjRfudPcS4/giphy.gif'
          }
        }
      })
      break
    case 'show_dog':
      bot.reply(message, {
        attachment: {
          type: 'image',
          payload: {
            url: 'https://media.giphy.com/media/3o7ZeL5FH6Ap9jR9Kg/giphy.gif'
          }
        }
      })
      break
    case 'show_paris':
      bot.reply(message, 'He was hired by CRITEO in 2014 as a Senior Technical Solutions Engineer. In 2016 he left the company to be hired at SMARTFOCUS as a Presales Consultant.')
      break
    case 'show_london':
      bot.reply(message, 'Tim began his career in 2006 with 6 months of internship as a project manager at MRM Worldwide, then at TBWA from 2006 to 2008 as a Project Manager then Technical Project Manager, and ~1 year at Ogilvy. He then became an entrepreneur and built Milky end of 2009. The company was bought in 2011, he left the project and built Mustang, which he ran \'till 2014.')
      break
  }
});

controller.hears(['call me (.*)', 'my name is (.*)'], 'message_received', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is my name', 'who am i'], 'message_received', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function(response, convo) {
                        convo.ask('You want me to call you `' + response.text + '`?', [
                            {
                                pattern: bot.utterances.yes,
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: bot.utterances.no,
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! I will update my dossier...');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});

controller.hears(['shutdown'], 'message_received', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'], 'message_received',
    function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named Timbot. I have been running for ' + uptime + ' on ' + hostname + '.');
    });



controller.on('message_received', function(bot, message) {
    bot.reply(message, 'Try: `what is my name` or `structured` or `call me captain`');
    return false;
});


function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
