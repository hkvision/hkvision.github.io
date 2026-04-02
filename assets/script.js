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

  // 手机端点击卡片触发遮罩效果
  $(document).on('touchend', '#works figure', function(e) {
    var $this = $(this);
    if (!$this.hasClass('tapped')) {
      $('#works figure').removeClass('tapped');
      $this.addClass('tapped');
      e.preventDefault();
    } else {
      $this.removeClass('tapped');
    }
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

  // 视频弹窗：专辑MV / 舞蹈视频 共用逻辑
  var pendingBvid = null;
  var pendingTitle = null;
  var videoReturnTarget = null;

  // 专辑内点击 MV → 关闭专辑弹窗后打开视频弹窗
  $(document).on('click', '.btn-mv', function() {
    pendingBvid  = $(this).data('bvid');
    pendingTitle = $(this).data('title');
    videoReturnTarget = '#album-modal';
    $('#album-modal').modal('hide');
  });
  $('#album-modal').on('hidden.bs.modal', function() {
    if (pendingBvid && videoReturnTarget === '#album-modal') {
      $('#video-modal-title').text(pendingTitle + ' - MV');
      $('#bilibili-player').data('bvid', pendingBvid);
      $('#video-modal').modal('show');
      pendingBvid = null;
    }
  });

  // 舞蹈数据
  var danceTracks = [
    { title: '此刻着陆',                    credit: '',                              videos: [{bvid:'BV1rjh3zFEdR',label:'Dance Break'},{bvid:'BV1EYbAzbEwF',label:'手势舞'}] },
    { title: 'HandClap',                    credit: 'Cover 马嘉祺 严浩翔 贺峻霖',    bvid: 'BV1we4y1o7Yh' },
    { title: '快意',                         credit: 'Cover 马嘉祺 丁程鑫 刘隽',      bvid: 'BV1H14y127P3' },
    { title: '要你管',                       credit: 'Cover 时代少年团',              bvid: 'BV1zN4y1g7ne' },
    { title: '玫瑰少年',                     credit: 'Cover 蔡依林',                  bvid: 'BV1mK4y1a721' },
    { title: 'Look What You Made Me Do',    credit: 'Cover 丁程鑫 宋亚轩 刘耀文 张真源', bvid: 'BV18K4y1f7pm' },
    { title: 'We Rock',                     credit: 'Cover 刘冠佑',                  bvid: 'BV1fq4y1n7Mi' },
    { title: '中枪舞',                       credit: 'Cover 易烊千玺',                bvid: 'BV1mZ4y1x7Hy' },
    { title: 'Party In Your Bedroom',       credit: 'Cover 易烊千玺',                bvid: 'BV1sE411N7qp' },
    { title: '姐姐恋爱吧',                   credit: 'Cover 台风少年团',              bvid: 'BV1CV411f7VX' },
    { title: '睫毛弯弯',                     credit: 'Cover 马嘉祺 刘耀文 张真源 严浩翔', bvid: 'BV1LZ4y1T7ZS' },
    { title: '朱雀',                         credit: 'Cover 时代少年团',              bvid: 'BV1mZ4y1Q78z' },
    { title: 'Bad Idea',                    credit: 'Cover 马嘉祺 丁程鑫',           bvid: 'BV1yH6GYmEDN' },
    { title: '少年之名',                     credit: 'Cover 左林杰',                  bvid: 'BV1kR4y1M7bj' },
    { title: '偶像万万岁',                   credit: 'Cover 易安音乐社',              bvid: 'BV19f4y1i7Nc' },
    { title: '华为 nova6 发布会舞蹈',        credit: 'Cover 易烊千玺',                bvid: 'BV1sA4y1D7Jj' },
    { title: 'O.R.E.A',                     credit: 'Cover 钟汉良',                  bvid: 'BV1oyZZY3EF2' },
    { title: '定格纪念',                     credit: 'Cover 易安音乐社',              bvid: 'BV1RV411Y7KX' },
    { title: '十年之约',                     credit: 'Cover TFBOYS',                 bvid: 'BV1hF411o7YG' },
    { title: '爱你',                         credit: 'Cover 王心凌',                  bvid: 'BV1FF41157S1' },
    { title: '我喜欢你',                     credit: 'Cover 时代少年团',              bvid: 'BV1Mv411u7KP' },
    { title: '绝配',                         credit: 'Cover 时代少年团',              bvid: 'BV18G4y1V7Rp' },
    { title: '我们一起闯',                   credit: 'Cover 林墨',                    bvid: 'BV1mV411E7yK' },
    { title: 'Here I AM',                   credit: 'Cover 井汲大翔',                bvid: 'BV1Ab411f74o' },
    { title: 'O.O.O',                       credit: 'Cover 沈小婷',                  bvid: 'BV1Gf4y1A7RG' },
    { title: 'Like JENNIE',                 credit: 'Cover JENNIE',                 bvid: 'BV1y4cFzZEUa' },
    { title: 'Freaky',                      credit: 'Tory Lanez',                   bvid: 'BV19A411w7nH' },
    { title: '告白气球',                     credit: '易烊千玺编舞',                  bvid: 'BV1sE411N7qp' },
    { title: 'My Boo',                      credit: '易烊千玺',                      bvid: 'BV1Jf4y187MV' },
    { title: '你最最最重要',                  credit: 'Cover 张艺凡',                  bvid: 'BV1pz411i71g' }
  ];

  // 渲染舞蹈列表
  $.each(danceTracks, function(i, t) {
    var num = (i + 1 < 10 ? '0' : '') + (i + 1);
    var titleHtml = t.title + (t.credit ? '<br><small style="color:#aaa;font-size:0.8em">' + t.credit + '</small>' : '');
    var btns = '';
    if (t.videos) {
      $.each(t.videos, function(j, v) {
        btns += '<button class="btn-dance-mv" data-bvid="' + v.bvid + '" data-title="' + t.title + ' ' + v.label + '">&#9654; ' + v.label + '</button>';
      });
    } else {
      btns = '<button class="btn-dance-mv" data-bvid="' + t.bvid + '" data-title="' + t.title + '">&#9654;</button>';
    }
    $('#dance-track-list').append(
      '<li class="album-track-item">' +
      '<span class="album-track-num">' + num + '</span>' +
      '<span class="album-track-title">' + titleHtml + '</span>' +
      '<span class="album-track-actions">' + btns + '</span>' +
      '</li>'
    );
  });

  // And More 结尾行
  $('#dance-track-list').append(
    '<li class="album-track-item" style="justify-content:center;color:#bbb;font-style:italic;letter-spacing:0.08em;">And More...</li>'
  );

  // 折叠16条之后的内容
  $('#dance-track-list .album-track-item:gt(14)').hide();
  $('#dance-track-list').after(
    '<div style="text-align:center;padding:0.8em">' +
    '<button id="dance-expand-btn" class="btn btn-default btn-sm">展开更多 ▾</button>' +
    '</div>'
  );
  var danceExpanded = false;
  $(document).on('click', '#dance-expand-btn', function() {
    danceExpanded = !danceExpanded;
    if (danceExpanded) {
      $('#dance-track-list .album-track-item:gt(14)').show();
      $(this).text('收起 ▴');
    } else {
      $('#dance-track-list .album-track-item:gt(14)').hide();
      $(this).text('展开更多 ▾');
    }
  });

  // 舞蹈弹窗内点击 B站 → 关闭舞蹈弹窗后打开视频弹窗
  $(document).on('click', '.btn-dance-mv', function() {
    pendingBvid  = $(this).data('bvid');
    pendingTitle = $(this).data('title');
    videoReturnTarget = '#dance-modal';
    $('#dance-modal').modal('hide');
  });
  $('#dance-modal').on('hidden.bs.modal', function() {
    if (pendingBvid && videoReturnTarget === '#dance-modal') {
      $('#video-modal-title').text(pendingTitle);
      $('#bilibili-player').data('bvid', pendingBvid);
      $('#video-modal').modal('show');
      pendingBvid = null;
    }
  });

  // 视频 modal：打开时加载 iframe，关闭时返回来源弹窗
  $('#video-modal').on('show.bs.modal', function() {
    var bvid = $('#bilibili-player').data('bvid');
    if (bvid) $('#bilibili-player').attr('src', 'https://player.bilibili.com/player.html?bvid=' + bvid + '&page=1');
  });
  $('#video-modal').on('hidden.bs.modal', function() {
    $('#bilibili-player').attr('src', '');
    if (videoReturnTarget) {
      var target = videoReturnTarget;
      videoReturnTarget = null;
      setTimeout(function() { $(target).modal('show'); }, 350);
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



