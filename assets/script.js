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

  // 专辑曲目数据（后续替换真实链接）
  var albumTracks = [
    { title: 'Track 01', audioIndex: 0, qqUrl: 'https://y.qq.com/n/ryqq_v2/songDetail/0039tIo02YCRDk', wyyUrl: null, bvid: 'BV1DT4y1U7qk', biliUrl: 'https://www.bilibili.com/video/BV1DT4y1U7qk' },
    { title: 'Track 02', audioIndex: 1, qqUrl: 'https://y.qq.com/', wyyUrl: null,                     bvid: null, biliUrl: null },
    { title: 'Track 03', audioIndex: 2, qqUrl: 'https://y.qq.com/', wyyUrl: null,                     bvid: null, biliUrl: null },
    { title: 'Track 04', audioIndex: 3, qqUrl: 'https://y.qq.com/', wyyUrl: null,                     bvid: null, biliUrl: null },
    { title: 'Track 05', audioIndex: 4, qqUrl: 'https://y.qq.com/', wyyUrl: null,                     bvid: null, biliUrl: null },
    { title: 'Track 06', audioIndex: 5, qqUrl: 'https://y.qq.com/', wyyUrl: null,                     bvid: null, biliUrl: null },
    { title: 'Track 07', audioIndex: 6, qqUrl: 'https://y.qq.com/', wyyUrl: null,                     bvid: null, biliUrl: null },
    { title: 'Track 08', audioIndex: 7, qqUrl: 'https://y.qq.com/', wyyUrl: null,                     bvid: null, biliUrl: null },
    { title: 'Track 09', audioIndex: 8, qqUrl: 'https://y.qq.com/', wyyUrl: null,                     bvid: null, biliUrl: null },
    { title: 'Track 10', audioIndex: 9, qqUrl: 'https://y.qq.com/', wyyUrl: 'https://music.163.com/', bvid: null, biliUrl: null }
  ];

  // 渲染专辑曲目列表
  $.each(albumTracks, function(i, t) {
    var num = (i + 1 < 10 ? '0' : '') + (i + 1);
    var titleHtml = t.qqUrl
      ? '<a class="album-track-link" href="' + t.qqUrl + '" target="_blank">' + t.title + '</a>'
      : (t.wyyUrl ? '<a class="album-track-link" href="' + t.wyyUrl + '" target="_blank">' + t.title + '</a>' : t.title);
    var actions = '';
    actions += '<button class="btn-play-track" data-audio-index="' + t.audioIndex + '">&#9654;</button>';
    if (t.bvid) actions += '<button class="btn-mv" data-bvid="' + t.bvid + '" data-title="' + t.title + '"><i class="fa fa-film"></i> MV</button>';
    $('#album-track-list').append(
      '<li class="album-track-item">' +
      '<span class="album-track-num">' + num + '</span>' +
      '<span class="album-track-title">' + titleHtml + '</span>' +
      '<span class="album-track-actions">' + actions + '</span>' +
      '</li>'
    );
  });

  // 专辑内点击播放 → 底部播放器（保持弹窗不关闭）
  $(document).on('click', '.btn-play-track', function() {
    var idx = parseInt($(this).data('audio-index'));
    loadSong(idx);
    audio.play();
    isPlaying = true;
    setPlayIcon();
  });

  // 专辑内点击 MV → 关闭专辑弹窗后打开视频弹窗
  var pendingBvid = null;
  var pendingTitle = null;
  $(document).on('click', '.btn-mv', function() {
    pendingBvid  = $(this).data('bvid');
    pendingTitle = $(this).data('title');
    $('#album-modal').modal('hide');
  });
  var videoFromAlbum = false;
  $('#album-modal').on('hidden.bs.modal', function() {
    if (pendingBvid) {
      videoFromAlbum = true;
      $('#video-modal-title').text(pendingTitle + ' - MV');
      $('#bilibili-player').data('bvid', pendingBvid);
      $('#video-modal').modal('show');
      pendingBvid = null;
    }
  });

  // 视频 modal：打开时加载 iframe，关闭时停止；若从专辑进入则返回专辑
  $('#video-modal').on('show.bs.modal', function() {
    var bvid = $('#bilibili-player').data('bvid');
    if (bvid) $('#bilibili-player').attr('src', 'https://player.bilibili.com/player.html?bvid=' + bvid + '&page=1');
  });
  $('#video-modal').on('hidden.bs.modal', function() {
    $('#bilibili-player').attr('src', '');
    if (videoFromAlbum) {
      videoFromAlbum = false;
      $('#album-modal').modal('show');
    }
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



