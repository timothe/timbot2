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

controller.hears(['bye', 'goodbye', 'adios'], 'message_received', function (bot, message) {
	bot.reply(message, 'All right, see ya!')
})

controller.hears(['his life', 'tim\'s life', 'his universe'], 'message_received', function (bot, message) {
	bot.reply(message, 'Wow that is broad... Can we be more precise? Experience, education, hobbies?...')
});

controller.hears(['his experience', 'tim\'s experience', 'work'], 'message_received', function (bot, message) {
	bot.reply('He worked 8 years in Paris in agencies and 2 years in London in tech companies')
	bot.reply({
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
})

controller.hears(['ogilvy'], 'message_received', function (bot, message) {
	bot.startConversation(message,function(err,convo) {	
		convo.say('MRM Worldwide is part of the McCann Erickson ad agencies group. This division is specialized in CRM communication with Nestlé, Gemey and Opel as their key clients');
		convo.say('Tim was a Project Manager there, working on Care, Mastercard, Gaz de France, and Eurofactor');
	});
});

controller.hears(['tbwa'], 'message_received', function (bot, message) {
	bot.startConversation(message,function(err,convo) {	
		convo.say('TBWA interactive is part of the TBWA ad agencies group. This division is specialized in digital communication')
		convo.say('On his 1st year Tim was focusing on Project Management, then he asked to switch to Technical Project Management')
		convo.say('He did a lot of different things there: concept design, development, technical consulting')
		convo.say('...and worked on great clients: ADIDAS, Arcelor Mittal, BNP Paribas, Michelin, McDonald’s, Amnesty, SNCF...')
	});

});

controller.hears(['milky'], 'message_received', function (bot, message) {
	bot.startConversation(message,function(err,convo) {	
		convo.say('Milky is a web agency leading brands to perform successful online communication')
		convo.say('The great Milky adventure began in 2009 with 3 other business partners. Tim was the Head of project management, also doing Business development and People Management')
		convo.say('The key clients were: ADIDAS, L’Oréal, Bourjois (FR, UK, CA), Etam, Longchamp, Nivea, Sarenza, Warner Bros, EMI, Voyages SNCF')
		convo.say('A company was interested in buying the agency in 2011. Tim decided to sell and go, while the partners and employees stayed')
		convo.say('Tim created Mustang a short time after')
	});
});

controller.hears(['mustang'], 'message_received', function (bot, message) {
	bot.startConversation(message,function(err,convo) {	
		convo.say('After selling his Milky shares, Tim immediately created Mustang Interactive, another web developement agency')
		convo.say('Some clients followed him in the deal, and the company grew \'till 2014, when Tim decided to close it and move to London')	
	})
})

controller.hears(['criteo'], 'message_received', function (bot, message) {
	bot.startConversation(message,function(err,convo) {	
		convo.say('Criteo helps advertisers generate more sales through personalized performance advertising (retargeting) at a global scale')
		convo.say('Tim had a very busy time there, where he was doing the onboarding for new clients, follow-up to debug and optimise existing campaigns...')
		convo.say('review and interview potential TS candidates')
		convo.say('train newcomers')
		convo.say('He worked on Desktop, Mobile web, In-App and Email advertising but also on publishers’ networks using different technologies (RTA, RTB, Passback, Cookie targeting)')
		convo.say('Tim got in touch on a day-to-day basis with the worldwide teams of Marks & Spencer, John Lewis, Debenhams, House of Fraser, Gap / Banana Republic, Hotels.com, Expedia, Hostel World, HomeAway, Monarch, Gumtree, Kijiji, EON, ...')
	})
})

controller.hears(['smartfocus'], 'message_received', function (bot, message) {
	bot.startConversation(message,function(err,convo) {	
		convo.say('SmartFocus enhances digital strategies for businesses with The Message Cloud, a powerful platform featuring big data-fuelled insights and enabling smart multi- channel campaigns')
		convo.say('Tim is pretty new there but he already met all the expectations of this different company and job')
		convo.say('His role consists of teaming up with sales people and meeting clients in Europe to demonstrate the abilities of the platform, create demo environments and dummy websites to contextualize the pitch according to the client’s needs')
		convo.say('But also answer RFPs / RFIs with the help of the Professional Services team and support the new Presales team by building a knowledge base and core materials')
	})
})

controller.hears(['education', 'school', 'masters', 'degree'], 'message_received', function (bot, message) {
	bot.startConversation(message,function(err,convo) {	
		convo.say('Tim studied at the University of Toulon (France) and graduated with a Master’s Degree \"Internet and Multimedia Engineering\" in 2006')
		convo.say('This curriculum is proposing a variety of classes for the professions around internet: Development, Design, Marketing, Law, etc. but also filming: Writing, Photography, Storyboard, Montage, etc')
		convo.say('The objective is to become a skilful Project Manager')
	});
})

controller.hears(['hobbies'], 'message_received', function (bot, message) {
	bot.startConversation(message,function(err,convo) {	
		convo.say('Tim is a fan of Internet culture in general, technology, and science')
		convo.say('He spends loads of time watching (qualitative) TV series and organising his next trip abroad')
		convo.say('Sports-wise, he\'s regularly practicing Muay Thai after years of the a classic jogging / weight lifting routine')
		convo.say('He\'s a big fan of cars and motorbikes too and got the chance to participate in some races in the past')
		convo.say('Well, among other cool stories ;)')
	});
})

controller.hears(['emea'], 'message_received', function (bot, message) {
	bot.reply(message, 'EMEA means Europe, Middle East and Africa :)')
})

controller.hears(['rfp', 'rfi'], 'message_received', function (bot, message) {
	bot.reply(message, 'RFP/RFI, Request For Proposal/Information: a set of basic questions the supplier should answer to to ensure they are keen to answer the client\'s needs')
})

controller.hears(['sncf'], 'message_received', function (bot, message) {
	bot.reply(message, 'Société Nationale des Chemins de fer Français (the French rail company) :)')
})

controller.hears(['suck'], 'message_received', function (bot, message) {
	bot.reply(message, 'I think you have me confused with Vacuum-bot')
})

controller.hears(['fuck', 'twat', 'cunt', 'bastard', 'dick', 'pute', 'putain'], 'message_received', function (bot, message) {
	bot.reply(message, '-_-')
})

controller.hears(['francais'], 'message_received', function (bot, message) {
	bot.reply(message, 'Désolé, je ne parle pas encore français :(')
})

  
controller.on('facebook_postback', function (bot, message) {
  switch (message.payload) {
    case 'show_london':
		bot.startConversation(message,function(err,convo) {	
		  convo.say({
		    attachment: {
		      type: 'image',
		      payload: {
		        url: 'http://thecoffeevine.com/wp-content/uploads/2016/04/london.jpg'
		      }
		    }
		  })
		  convo.say('He was hired by Criteo in 2014 as a Senior Technical Solutions Engineer. In 2016 he left the company to be hired at SmartFocus as a Presales Consultant')
		});
        break
    case 'show_paris':
		bot.startConversation(message,function(err,convo) {	
		  convo.say({
		    attachment: {
		      type: 'image',
		      payload: {
		        url: 'https://c8.staticflickr.com/8/7003/6672156239_01bde2b717_b.jpg'
		      }
		    }
		  })
		  convo.say('Tim began his career in 2006 with 6 months of internship as a project manager at MRM Worldwide')
		  convo.say('...then at TBWA from 2006 to 2008 as a Project Manager and Technical Project Manager')
		  convo.say('...and ~1 year at Ogilvy again as a Technical Project Manager.')
		  convo.say('He then became an entrepreneur and built Milky at the end of 2009. The company was bought in 2011, he left the project and built Mustang, which he ran \'till 2014')
		});
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


controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'], 'message_received', function(bot, message) {
    var hostname = os.hostname();
    var uptime = formatUptime(process.uptime());
    bot.reply(message, ':|] I am a bot named Timbot. I have been running for ' + uptime + '.');
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

    uptime = uptime.toFixed(2) + ' ' + unit;
    return uptime;
}
