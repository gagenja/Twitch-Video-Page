//Calls the Twitch API usen the given url and client ID
function APICall(url, callback) {
	$(document).ready(function(){
		$.ajax({
			url:url,
			headers:{"Client-ID": "1qsoixw48ug5pg9v87t3a0v89hjt1y"},
			success:function(result) {
				callback(result);
			},
			error:function(result) {
				console.log("API Call failed");
			}
		});
	});	
}

//Video Search Page

//Populates video list using passed in JSON object from API request
function displayVids(data) {
	var i, title, thumbnail, id, url;
	//create a div for each video containing its name and thumbnail
	for(i = 0; i < data.videos.length; i++) {
		title = data.videos[i].title;
		thumbnail = data.videos[i].thumbnails[0].url;	
		id = data.videos[i]._id;
		url = "details.html?id=" + id;
		$("#videos").append("<div class='vid' id='" + id 
		+ "' onclick='window.location=\"" + url +"\";'>" 
		+ title + "<img src='" + thumbnail + "'></div>");
	}
}

//Searches for videos by user or game
function searchVids() {
	//read value of searchBy to determine type of search
	$(document).ready(function() {
		if($("#searchBy").val()=="user") {
			var url = "https://api.twitch.tv/kraken/search/channels?query=" + $("#vidSearch").val();
			APICall(url, searchByUser);
		}
		else {
			var url = "https://api.twitch.tv/kraken/search/games?type=suggest&query=" + $("#vidSearch").val();
			APICall(url, searchByGame);
		}
	});
}

//Gets the 20 most recent videos of each user found from search and passes to displayVids
function searchByUser(data) {
	var i;
	for(i = 0; i < data.channels.length; i++) {
		var url = "https://api.twitch.tv/kraken/channels/" + data.channels[i].name + "/videos?limit=20&broadcast_type=all&sort=time";
		APICall(url, displayVids);
	}
}

//Gets the 20 most recent videos of each game found from search and passes to displayVids
function searchByGame(data) {
	var i;
	for(i = 0; i < data.games.length; i++) {
		var url = "https://api.twitch.tv/kraken/videos/top?limit=20&sort=time&game=" + data.games[i].name;
		APICall(url, displayVids)
	}
}

//Details Page

//Displays the given video's information on the Details Page
function displayDetails(video) {
	var id, title, channel, description, published, url, type, game, viewcount;
	id = video._id
	title = video.title;
	channel = video.channel.display_name;
	description = video.description;
	published = new Date(video.published_at);
	url = video.url;
	type = video.broadcast_type;
	game = video.game;
	viewcount = video.views;
	$("#title").text(title);
	$("#channel").text("By " + channel);
	$("#vidPlayer").append("<iframe src='http://player.twitch.tv/?video=" + id +
	"&autoplay=false'" +
    "height='720'" +
    "width='1280'" +
    "frameborder='0'" +
    "scrolling='no'" +
    "allowfullscreen='true'>" +
	"</iframe>");
	$("#details").append("<h3>Views: " + viewcount + "</h3>");
	$("#details").append("<h3>Published: " + published.toDateString() + "</h3>");
	$("#details").append("<h3>Broadcast Type: " + type + "</h3>");
	$("#details").append("<h3>Game: " + game + "</h3>");
	if(description != null) {
		$("#details").append("<h3>Description:</h3>" + "<p>" + description + "</p>");
	}
	$("#details").append("<a href='" + url + "' color='white'>View on Twitch!</a>");
}