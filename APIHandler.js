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

//Populates video list using passed in JSON object from API request
function displayVids(videos) {
	var i, title, thumbnail, id, url;

	for(i = 0; i < videos.data.length; i++) {
		title = videos.data[i].title;
		if(videos.data[i].type != "live") {
			thumbnail = videos.data[i].thumbnail_url.replace("%{width}", "355").replace("%{height}", "200");
		}
		else {
			thumbnail = videos.data[i].thumbnail_url.replace("{width}", "355").replace("{height}", "200");
		}
		id = videos.data[i].id;
		url = "details.html?id=" + id;
		$("#videos").append("<div class='vid' id='" + id + "' onclick='window.location=\"" + url +"\";'>" 
			+ title + "<img src='" + thumbnail + "'></div>");
	}
}

function searchVids() {
	<!-- use jquery to read value of searchBy to determine type of search -->
	$(document).ready(function() {
		if($("#searchBy").val()=="user") {
			var url = "https://api.twitch.tv/helix/users?login=" + $("#vidSearch").val();
			APICall(url, searchByUser);
		}
		else {
			var url = "https://api.twitch.tv/helix/games?name=" + $("#vidSearch").val();
			APICall(url, searchByGame);
		}
	});
}

function searchByUser(users) {	
	var url = "https://api.twitch.tv/helix/videos?user_id=" + users.data[0].id;
	APICall(url, displayVids);
}

function searchByGame(games) {
	var url = "https://api.twitch.tv/helix/streams?game_id=" + games.data[0].id;
	APICall(url, displayVids)
}

