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
  
controller.on('facebook_postback', function (bot, message) {
  switch (message.payload) {
    case 'show_london':
      bot.reply(message, {
        attachment: {
          type: 'image',
          payload: {
            url: 'http://thecoffeevine.com/wp-content/uploads/2016/04/london.jpg'
          }
        }
      })
      bot.reply(message, 'He was hired by Criteo in 2014 as a Senior Technical Solutions Engineer. In 2016 he left the company to be hired at SmartFocus as a Presales Consultant')
      break
    case 'show_paris':
      bot.reply(message, {
        attachment: {
          type: 'image',
          payload: {
            url: 'https://c8.staticflickr.com/8/7003/6672156239_01bde2b717_b.jpg'
          }
        }
      })
      bot.reply(message, 'Tim began his career in 2006 with 6 months of internship as a project manager at MRM Worldwide, then at TBWA from 2006 to 2008 as a Project Manager then Technical Project Manager, and ~1 year at Ogilvy. He then became an entrepreneur and built Milky end of 2009. The company was bought in 2011, he left the project and built Mustang, which he ran \'till 2014')
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
            ':|] I am a bot named Timbot. I have been running for ' + uptime + '.');
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
