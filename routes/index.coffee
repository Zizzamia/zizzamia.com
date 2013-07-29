dateformat = require '../lib/dateformat'
twit = require '../lib/twitter_data'

parse_url = (tweet) ->
    return tweet.replace /[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, (url) ->
        return "<a href=\"#{url}\" target=\"_blank\">#{url}</a>"

profile_image =
    screen_name: 'zizzamia',
    size: 'bigger',
    image: ''

twit.get 'users/show', { screen_name: 'zizzamia' }, (err, data) ->
    try
        console.log(data.profile_image_url.substring(0,data.profile_image_url.length - 12) + '.jpeg')
        profile_image['image'] = data.profile_image_url.substring(0,data.profile_image_url.length - 12) + '.jpeg'
    catch
        console.log("Error: get twitter profile")
        profile_image['image'] = ""
    
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
    console.log route
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
    twit.get 'statuses/user_timeline', user_timeline, (err, data) ->
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