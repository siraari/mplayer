// JavaScript Document

$(function(){
	
	var input_file;//送信されたオーディオファイルの配列
	var file_list = new Array();
	var mplayer_audio_id;//再生中の<audio>タグのid
	var mplayer_audio_id_next;//次に再生される曲の<audio>タグのid
	var audio_num;//再生中のオーディオナンバー
	var set_audio;//再生中のオーディオエレメント
	var audio_length = 0;//リストの長さ
	
	//ファイル送信
	$(document).on("click","#form_submit",function(){		
		input_file = document.getElementById("input_music").files;//送信ファイルの取得
		var file_length = input_file.length;//送信ファイルの数（for文で各ファイルをまわすために使用）
		
		for(var i = 0 ; i < file_length; i++){
			file_list[i+audio_length] = input_file[i];

			var file = input_file[i];
			var file_name = getFileName(file.name);
			
			//createObjectURL作成
		      var tmpURL;
			  if (typeof file !== 'object'){return;}
			  if (!file.type.match(/^audio\//)){return;}
			  if (window.createObjectURL){
				  tmpURL = window.createObjectURL(file);
			  	}else if (window.webkitURL){
					  tmpURL = window.webkitURL.createObjectURL(file);
				}else if (window.URL){
						  tmpURL = window.URL.createObjectURL(file);
				}else{
							  return;
				}
				//createObjectURL作成終了;
				
				$("#mplayer_audio_box").append('<audio src="'+tmpURL+'" id="mplayer_audio'+(i+audio_length)+'" class="audio_file'+(i+audio_length+1)+'"></audio>');//送信されたファイルの<audio>タグの作成（#mplayer_audio_box内に）
				
				//曲のリスト作成
				$("#mplayer_mlist").append('<li><span class="audio_file'+(i+audio_length+1)+'">'+(i+audio_length+1)+'</span>.'+file_name+'</br>start:<input type="text" size="10" placeholder="start" class="mstart_time" id="start_audio'+(i+audio_length+1)+'" />stop:<input type="text" placeholder="stop" size="10" class="mstop_time" id="stop_audio'+(i+audio_length+1)+'" />fadeIn:<input type="text" size="10" placeholder="fadeIn" class="mfadeIn_time" id="fadeIn_audio'+(i+audio_length+1)+'" />fadeOut:<input type="text" size="10" placeholder="fadeOut" class="mfadeOut_time" id="fadeOut_audio'+(i+audio_length+1)+'" />nextStart:<input type="text" size="10" placeholder="nextStart" class="mnextStart_time" id="nextStart_audio'+(i+audio_length+1)+'" /></li>');
				//<li><span c=audio_file(i+audio_length+1)><start c="mstart_time" id="start_audio(i+audio_length+1)">以下同様				
				
				}//for終了
				
				$("#mplayer_t_bg h2").text(input_file[0].name);//ファイル送信終了時の再生曲のファイル名をh2に
				mplayer_audio_id = $('#mplayer_audio_box audio.audio_file'+(audio_length+1)).attr("id");//再生曲目のidの取得
				audio_num = Number(mplayer_audio_id.substr(13));//再生曲のidナンバー取得
				set_audio = document.getElementById(mplayer_audio_id);//再生曲の<audio>エレメントのセット
				audio_length = document.getElementById("mplayer_audio_box").childNodes.length - 1;//送信後の曲目リストの数
				if(audio_length == 1){
					mplayer_audio_id_next = $('#mplayer_audio'+(audio_num)).attr("id");
				}else{
					mplayer_audio_id_next = $('#mplayer_audio'+(audio_num+1)).attr("id");//次に再生する曲のid取得
				}

	});//ファイル送信(#form_submit click)終了
	
	
	//曲目リストの番号クリックで再生用の曲入れ替え
	$(document).on("click","#mplayer_mlist li span",function(){
		set_audio = document.getElementById(mplayer_audio_id);
		set_audio.pause();//曲入れ替え時に再生停止
		set_audio.currentTime = 0;
		var playAudio_class = $(this).attr("class");
		mplayer_audio_id = $('#mplayer_audio_box audio.'+playAudio_class).attr("id");
		audio_num = Number(mplayer_audio_id.substr(13));
		$("#mplayer_t_bg h2").text(file_list[audio_num].name);//input_file[]からファイル名を取得してh2へ挿入
		if((audio_num + 1) == audio_length){
			mplayer_audio_id_next = $('#mplayer_audio0').attr("id");
		}else{
			mplayer_audio_id_next = $('#mplayer_audio'+(audio_num+1)).attr("id");
		}
	});//#mplayer_mlist li.click終了
	
	
	//再生
	$(document).on("click",".mplayer_play",function mplayer_play(){
		set_audio = document.getElementById(mplayer_audio_id);
		
		var audio_start_time = 0;
		var audio_fadeIn_time = 0;
		var audio_fadeOut_time = 0;
		var audio_stop_time;
		var audio_nextStart_time;
		var temp_volume;
		
		var audio_fullTime = set_audio.duration;
		
		var play_fileName = getFileName($("#mplayer_t_bg h2").text());//再生中画面のh2からファイル名を取得
		//開始終了、フェードインアウト等の時間設定の取得
		audio_start_time = Number(document.getElementById("start_audio"+(audio_num+1)).value);
		audio_fadeIn_time = Number(document.getElementById("fadeIn_audio"+(audio_num+1)).value);
		audio_fadeOut_time = Number(document.getElementById("fadeOut_audio"+(audio_num+1)).value);
		audio_stop_time = Number(document.getElementById("stop_audio"+(audio_num+1)).value);
		audio_nextStart_time = Number(document.getElementById("nextStart_audio"+(audio_num+1)).value);
		
		//start_time
		if(set_audio.currentTime == 0){
		set_audio.currentTime = audio_start_time;
		}
		
		//fadeIn_time
		if(audio_fadeIn_time == ""){
			temp_volume = 100;
			set_audio.volume = 1;
			set_audio.play();
		}else{
			temp_volume = 0;
			set_audio.volume = temp_volume;
			set_audio.play();
			var timerId_fadeIn = setInterval(function(){
				temp_volume += 1;				
				if(temp_volume > 100){
					temp_volume = 100;
					set_audio.volume = 1;
					clearInterval(timerId_fadeIn);
				}else{
				set_audio.volume = temp_volume/100;
				}
				var i = 0;
				i += 1;
				console.log(i);
				console.log(temp_volume);
			},audio_fadeIn_time*10);
		}
		//faseIn_time終了
		
		//stop_time
		if(audio_fadeOut_time == ""){
			if(audio_stop_time == ""){
				audio_stop_time = audio_fullTime;
			}
			set_audio.addEventListener("timeupdate",function(){
				if(set_audio.currentTime >= audio_stop_time){
					set_audio.pause();
					set_audio.currentTime = 0;
				}
			},true);
		}else{
			if(audio_stop_time == ""){
				audio_stop_time = audio_fullTime;
			}
			
			var event_switch = 0;
			
			set_audio.addEventListener("timeupdate",fadeOut_timeupdate,true);
			set_audio.addEventListener("pause",function(){
				set_audio.removeEventListener("timeupdate",fadeOut_timeupdate,true);
			},true);
			function fadeOut_timeupdate(){
				if(set_audio.currentTime >= audio_stop_time - audio_fadeOut_time){
					if(event_switch == 0){
						event_switch = 1;
						console.log("event_switch");
						var timer_fadeOut = setInterval(function(){
							temp_volume -= 1;
							if(temp_volume < 0){
								console.log(temp_volume);
								temp_volume = 0;
								set_audio.volume = 0;
								set_audio.pause();
								set_audio.currentTime = 0;
								event_switch = 0;
								clearInterval(timer_fadeOut);
							}else{
								set_audio.volume = temp_volume/100;
							}
							console.log(1);
						},audio_fadeOut_time*10);
						temp_volume = 100;
					}//eventswitch判断
				}
			}//関数fadeOut_timeupdate終了
			
		}
		//stop_time終了
		
		/*
		if(audio_nextStart_time !== ""){
			set_audio.addEventListener("timeupdate",function audio_nextStart(){
				if(set_audio.currentTime >= audio_nextStart_time){
					set_audio.removeEventListener("timeupdate",audio_nextStart());
					mplayer_play();
					console.log("hogehoge");
				}
			});
		}*/
	});
		//再生終了

	
	
	$(".mplayer_stop").click(function(){
		var set_audio = document.getElementById(mplayer_audio_id);
		set_audio.pause();
		set_audio.currentTime = 0;
	});

	$(".mplayer_pause").click(function(){
		var set_audio = document.getElementById(mplayer_audio_id);
		set_audio.pause();	
	});
	
		//パスからファイル名を取得する関数
	function getFileName(file_path) {
		// Extract a file name with the extension.
		name_ext = file_path.substring(file_path.lastIndexOf("/")+1, file_path.length);  
		// Extract only the name part of the file.  
		name = name_ext.substring(0, name_ext.indexOf("."));
		return name;
	} 
	
	$("#checkState").click(function(){
		for(var i = 0; i < audio_length; i++){
			console.log(file_list[i].name);
		}
	});
});//実行コード終了