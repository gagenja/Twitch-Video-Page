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

function searchByUser(data) {
	var i;
	for(i = 0; i < data.channels.length; i++) {
		var url = "https://api.twitch.tv/kraken/channels/" + data.channels[i].name + "/videos?limit=20&broadcast_type=all&sort=time";
		APICall(url, displayVids);
	}
}

function searchByGame(data) {
	var i;
	for(i = 0; i < data.games.length; i++) {
		var url = "https://api.twitch.tv/kraken/videos/top?limit=20&game=" + data.games[i].name;
		APICall(url, displayVids)
	}
}

//Details Page

function displayDetails(video) {
	var id, title, channel, description, published, url, type, thumbnail, viewcount, duration;
	id = video._id
	title = video.title;
	channel = video.channel.display_name;
	description = video.description;
	published = video.published_at;
	url = video.url;
	type = video.broadcast_type;
	thumbnail = video.thumbnails[0].url;
	viewcount = video.views;
	$("#title").text(title);
	$("#channel").text(channel);
	$("#vidPlayer").append("<iframe src='http://player.twitch.tv/?video=" + id +
	"&autoplay=false'" +
    "height='720'" +
    "width='1280'" +
    "frameborder='0'" +
    "scrolling='no'" +
    "allowfullscreen='true'>" +
	"</iframe>");
	if(description != null) {
		$("#details").append("<p>" + description + "</p>");
	}
}