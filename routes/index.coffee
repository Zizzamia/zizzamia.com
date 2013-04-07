twitter = require '../lib/twitter'
dateformat = require '../lib/dateformat'

parse_url = (tweet) ->
    return tweet.replace /[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, (url) ->
        return "<a href=\"#{url}\" target=\"_blank\">#{url}</a>"

# Instantiates new Twitter object
twit = new twitter({
	consumer_key: '',
	consumer_secret: '',
	access_token_key: '',
	access_token_secret: ''
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
    count:40
    
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
        for x in data
            x.text = parse_url(x.text)
            x.media = undefined
            if x['entities']['media'] != undefined
                if x['entities']['media'][0]['media_url'] != undefined
                    x.media = x['entities']['media'][0]['media_url']
        res.json(data)
        
exports.algorithms = (req, res) ->
    log(req)
    page =
        'title': 'Algorithms',
        'description': 'The algorithms are developed in Javascript, Canvas and a bit of CoffeeScript.'
    res.render 'algorithms/index.html', page
    
exports.kruskal = (req, res) ->
    log(req)
    page =
        'title': 'Algorithms | Kruskal',
        'description': 'Animation of Kruskal\'s algorithm based on Javascript, Canvas and a bit of CoffeeScript.'
    res.render 'algorithms/kruskal.html', page
    
exports.dijkstra = (req, res) ->
    log(req)
    page =
        'title': 'Algorithms | Dijkstra',
        'description': 'Animation of Dijkstra\'s Algorithm based on Javascript, Canvas and a bit of CoffeeScrip.'
    res.render 'algorithms/dijkstra.html', page