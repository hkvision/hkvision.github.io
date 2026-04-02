 jQuery(document).ready(function($) {

  // 音乐播放器
  var songs = [
    { title: 'Track 01', file: 'audio/01.mp3' },
    { title: 'Track 02', file: 'audio/02.mp3' },
    { title: 'Track 03', file: 'audio/03.mp3' },
    { title: 'Track 04', file: 'audio/04.mp3' },
    { title: 'Track 05', file: 'audio/05.mp3' },
    { title: 'Track 06', file: 'audio/06.mp3' },
    { title: 'Track 07', file: 'audio/07.mp3' },
    { title: 'Track 08', file: 'audio/08.mp3' },
    { title: 'Track 09', file: 'audio/09.mp3' },
    { title: 'Track 10', file: 'audio/10.mp3' }
  ];

  var currentIndex = 0;
  var isPlaying = false;
  var audio = document.getElementById('audio-player');

  // 渲染歌单
  $.each(songs, function(i, song) {
    $('#player-list').append(
      '<li class="player-list-item' + (i === 0 ? ' active' : '') + '" data-index="' + i + '">' +
      '<span class="player-list-num">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span>' +
      '<span class="player-list-title">' + song.title + '</span>' +
      '<i class="fa fa-play player-list-icon"></i>' +
      '</li>'
    );
  });

  function loadSong(index) {
    currentIndex = index;
    audio.src = songs[index].file;
    $('.player-title').text(songs[index].title);
    $('.player-list-item').removeClass('active');
    $('.player-list-item[data-index="' + index + '"]').addClass('active');
    $('.player-progress-bar').css('width', '0%');
    $('.player-current').text('0:00');
    $('.player-duration').text('0:00');
  }

  function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function setPlayIcon() {
    $('#player-play i').attr('class', 'fa fa-pause');
    $('.player-list-item[data-index="' + currentIndex + '"] .player-list-icon')
      .attr('class', 'fa fa-pause player-list-icon');
  }

  function setPauseIcon() {
    $('#player-play i').attr('class', 'fa fa-play');
    $('.player-list-icon').attr('class', 'fa fa-play player-list-icon');
  }

  loadSong(0);

  $('#player-play').click(function() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      setPauseIcon();
    } else {
      audio.play();
      isPlaying = true;
      setPlayIcon();
    }
  });

  $('#player-prev').click(function() {
    loadSong((currentIndex - 1 + songs.length) % songs.length);
    if (isPlaying) { audio.play(); setPlayIcon(); }
  });

  $('#player-next').click(function() {
    loadSong((currentIndex + 1) % songs.length);
    if (isPlaying) { audio.play(); setPlayIcon(); }
  });

  $(audio).on('timeupdate', function() {
    if (audio.duration) {
      $('.player-progress-bar').css('width', (audio.currentTime / audio.duration * 100) + '%');
      $('.player-current').text(formatTime(audio.currentTime));
      $('.player-duration').text(formatTime(audio.duration));
    }
  });

  $(audio).on('ended', function() {
    loadSong((currentIndex + 1) % songs.length);
    audio.play();
    setPlayIcon();
  });

  $('.player-progress').click(function(e) {
    if (audio.duration) {
      audio.currentTime = (e.offsetX / $(this).width()) * audio.duration;
    }
  });

  $(document).on('click', '.player-list-item', function() {
    loadSong(parseInt($(this).data('index')));
    audio.play();
    isPlaying = true;
    setPlayIcon();
  });

  // 歌单展开/收起
  $('#player-toggle').click(function() {
    $('#music-playlist').toggleClass('open');
    $(this).toggleClass('open');
  });

  // 打开视频 modal 时加载 iframe，关闭时停止播放
  $('#video-modal').on('show.bs.modal', function() {
    var player = $('#bilibili-player');
    player.attr('src', player.data('src'));
  });
  $('#video-modal').on('hidden.bs.modal', function() {
    $('#bilibili-player').attr('src', '');
  });
 
    $(".scroll a, .navbar-brand, .gototop").click(function(event){   
    event.preventDefault();
    $('html,body').animate({scrollTop:$(this.hash).offset().top}, 600,'swing');
    $(".scroll li").removeClass('active');
    $(this).parents('li').toggleClass('active');
    });
    });






var wow = new WOW(
  {
    boxClass:     'wowload',      // animated element css class (default is wow)
    animateClass: 'animated', // animation css class (default is animated)
    offset:       0,          // distance to the element when triggering the animation (default is 0)
    mobile:       true,       // trigger animations on mobile devices (default is true)
    live:         true        // act on asynchronously loaded content (default is true)
  }
);
wow.init();




$('.carousel').swipe( {
     swipeLeft: function() {
         $(this).carousel('next');
     },
     swipeRight: function() {
         $(this).carousel('prev');
     },
     allowPageScroll: 'vertical'
 });



