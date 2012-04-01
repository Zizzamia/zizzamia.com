twitter = require '../lib/twitter'
dateformat = require '../lib/dateformat'

# Instantiates new Twitter object
twit = new twitter({
	consumer_key: 'zo5xn9MiS4hjEPl1saXFQ',
	consumer_secret: 'JcnsuCOI9jbrhJB1oeLn4xKUyoVsuGeFZ68nAyGyRHs',
	access_token_key: '25728571-pkadhqZbTeNqh5W6TKmCnTguPzOseyeX5seWskcWS',
	access_token_secret: 'nzv835V5iaQOwY4tg4ZeiCeRohJ7EzR7bfVNufc'
})


profile_image =
    screen_name: 'zizzamia',
    size: 'bigger',
    image: ''
    
twit.userProfileImage 'zizzamia', profile_image, (data) ->
    profile_image['image'] = data.substring(0,data.length - 10) + 'reasonably_small.jpg'
    
user_timeline =
    include_entities:true, 
    include_rts:true,
    screen_name:'zizzamia', 
    count:20
    
log = (req) ->
    now = new Date()
    utc = dateformat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    head = req.headers
    route = req.route
    text = route.path + ' - ' + route.method + ' - ' + head.host + ' - ' + head['user-agent'].split(' ')[0] + ' - ' + utc
    console.log(text)

exports.index = (req, res) ->
    log(req)
    page =
        'title': 'Leonardo Zizzamia',
        'description': 'Web developer working at FrameStore, London UK. Creator of Tiramisu.js and Bombolone',
        'profile_image': profile_image['image'],
    res.render 'index.html', page

exports.timeline = (req, res) ->
    log(req)
    twit.get '/statuses/user_timeline.json', user_timeline, (data) ->
        page = 
            'tweets': data,
            'layout': false
        res.render 'timeline.html', page
        
exports.algorithms = (req, res) ->
    log(req)
    page =
        'title': 'Zizzamia.com | Algorithms',
        'description': 'The algorithms were developed in Object-oriented JavaScript and Canvas, by Leonardo Zizzamia.'
    res.render 'algorithms/index.html', page
    
exports.dijkstra = (req, res) ->
    log(req)
    page =
        'title': 'Zizzamia.com | Algorithms',
        'description': 'The algorithms were developed in Object-oriented JavaScript and Canvas, by Leonardo Zizzamia.'
    res.render 'algorithms/dijkstra.html', page