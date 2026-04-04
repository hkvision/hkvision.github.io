// Nav logo easter eggs
(function() {
  var colors = [
    { f: 'hue-rotate(60deg) saturate(1.3) drop-shadow(0 0 7px rgba(140,50,220,0.8))',
      fb: 'hue-rotate(60deg) saturate(1.5) drop-shadow(0 0 14px rgba(170,80,255,1))', pulse: true },
    { f: 'hue-rotate(90deg) saturate(1.4) drop-shadow(0 0 7px rgba(220,50,130,0.8))',
      fb: 'hue-rotate(90deg) saturate(1.6) drop-shadow(0 0 14px rgba(255,80,160,1))', pulse: true },
    { f: 'hue-rotate(200deg) saturate(2) brightness(1.05) drop-shadow(0 0 7px rgba(210,140,0,0.8))',
      fb: 'hue-rotate(200deg) saturate(2.2) brightness(1.1) drop-shadow(0 0 14px rgba(255,175,0,1))', pulse: true },
    { f: 'hue-rotate(270deg) saturate(1.3) drop-shadow(0 0 7px rgba(30,160,80,0.8))',
      fb: 'hue-rotate(270deg) saturate(1.5) drop-shadow(0 0 14px rgba(50,210,100,1))', pulse: true },
    { f: 'hue-rotate(330deg) saturate(1.4) drop-shadow(0 0 7px rgba(0,185,220,0.8))',
      fb: 'hue-rotate(330deg) saturate(1.6) drop-shadow(0 0 14px rgba(0,225,255,1))', pulse: true },
    { f: 'grayscale(0.8) brightness(1.05) drop-shadow(0 0 6px rgba(160,185,230,0.8))',
      fb: 'grayscale(0.8) brightness(1.2) drop-shadow(0 0 12px rgba(200,220,255,1))', pulse: true },
  ];
  // Probability: 50% default, 15% v1, 15% v2, 20% colour
  var r = Math.random();
  var pick = null;
  if      (r < 0.50) { pick = null; }
  else if (r < 0.65) { pick = { src: 'images/logo-variations/v1.png' }; }
  else if (r < 0.80) { pick = { src: 'images/logo-variations/v2.png' }; }
  else               { pick = colors[Math.floor(Math.random() * colors.length)]; }

  if (!pick) return;
  var img = document.getElementById('nav-logo') && document.getElementById('nav-logo').querySelector('img');
  if (!img) return;
  if (pick.src) {
    var isMobile = window.innerWidth < 768;
    var varH = isMobile
      ? { 'v1.png': 32, 'v2.png': 32 }
      : { 'v1.png': 52, 'v2.png': 38 };
    var variantName = pick.src.split('/').pop();
    img.src = pick.src;
    img.style.height = (varH[variantName] || 30) + 'px';
    img.style.width = 'auto';
  } else {
    img.style.setProperty('--logo-filter', pick.f);
    img.style.setProperty('--logo-filter-bright', pick.fb);
    img.style.filter = pick.f;
    if (pick.pulse) img.classList.add('logo-easter-pulse');
  }
})();

// Trigger loading of all deferred images (data-src / data-srcset)
function loadDeferredImages() {
  document.querySelectorAll('source[data-srcset]').forEach(function(el) {
    el.srcset = el.getAttribute('data-srcset');
  });
  document.querySelectorAll('img[data-src]').forEach(function(el) {
    el.src = el.getAttribute('data-src');
  });
}

// Welcome overlay
(function() {
  var overlay = document.getElementById('welcome-overlay');
  if (!overlay) { loadDeferredImages(); return; }
  if (sessionStorage.getItem('hkv_welcomed')) {
    overlay.classList.add('done');
    loadDeferredImages();
    return;
  }
  document.body.style.overflow = 'hidden';
  overlay.addEventListener('click', function(e) {
    var logoSplit = document.getElementById('logo-split');
    if (!logoSplit || !logoSplit.contains(e.target)) return;
    loadDeferredImages(); // start fetching content the moment user clicks
    var works = document.getElementById('works');
    if (works) works.style.pointerEvents = 'none';
    var lLeft  = document.getElementById('logo-half-left');
    var lRight = document.getElementById('logo-half-right');
    var hint   = document.getElementById('welcome-hint');
    var sub    = document.getElementById('welcome-sub');
    if (lLeft)  { lLeft.style.opacity  = '1'; lLeft.style.animation  = 'none'; }
    if (lRight) { lRight.style.opacity = '1'; lRight.style.animation = 'none'; }
    if (hint)   { hint.style.opacity   = '1'; hint.style.animation   = 'none'; }
    if (sub)    { sub.style.opacity    = '1'; sub.style.animation    = 'none'; }
    void overlay.offsetWidth; // force reflow so browser commits opacity:1 before transition
    // Text elements: drive fade-out via inline style (inline opacity overrides CSS rules)
    if (hint) hint.style.opacity = '0';
    if (sub)  sub.style.opacity  = '0';
    overlay.classList.add('open');
    setTimeout(function() {
      overlay.classList.add('done');
      document.body.style.overflow = '';
      sessionStorage.setItem('hkv_welcomed', '1');
      if (works) works.style.pointerEvents = '';
    }, 980);
  });
})();

jQuery(document).ready(function($) {

  // 音乐播放器
  var songs = [
    { title: '待解锁 敬请期待',        file: '',              locked: true },
    { title: '和自己对话',             file: 'audio/02.mp3' },
    { title: '样（YOUNG）',            file: 'audio/03.mp3' },
    { title: 'HKVISION LAND',          file: 'audio/06.wav' },
    { title: 'Fall',                   file: 'audio/05.mp3' },
    { title: '待解锁 敬请期待',        file: '',              locked: true },
    { title: '此刻回望',               file: 'audio/07.mp3' },
    { title: '嘿，你还好吗',           file: 'audio/08.mp3' },
    { title: '记录你所给我的一切',     file: 'audio/09.mp3' },
    { title: '此刻着陆',               file: 'audio/10.mp3' },
    { title: '同乘',                   file: 'audio/11.mp3' },
    { title: '给未来的自己',           file: 'audio/12.mp3' }
  ];

  var currentIndex = 0;
  var isPlaying = false;
  var audio = document.getElementById('audio-player');

  function nextPlayable(from, direction) {
    var step = direction === 'prev' ? -1 : 1;
    var i = (from + step + songs.length) % songs.length;
    while (i !== from) {
      if (!songs[i].locked) return i;
      i = (i + step + songs.length) % songs.length;
    }
    return from;
  }

  // 播放模式：0=顺序循环 1=随机 2=单曲循环
  var playMode = 0;
  var modes = [
    { icon: 'fa fa-repeat',  label: '顺序循环' },
    { icon: 'fa fa-random',  label: '随机播放' },
    { icon: 'fa fa-repeat',  label: '单曲循环', badge: '1' }
  ];
  function updateModeBtn() {
    var m = modes[playMode];
    $('#player-mode i').attr('class', m.icon);
    $('#player-mode').attr('title', m.label).toggleClass('mode-active', playMode !== 0);
    $('#player-mode .mode-badge').remove();
    if (m.badge) $('#player-mode').append('<span class="mode-badge">' + m.badge + '</span>');
  }
  $('#player-mode').click(function() {
    playMode = (playMode + 1) % 3;
    updateModeBtn();
  });
  updateModeBtn();

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
    $('.player-list-icon').attr('class', 'fa fa-play player-list-icon');
    $('.player-list-item[data-index="' + currentIndex + '"] .player-list-icon')
      .attr('class', 'fa fa-pause player-list-icon');
  }

  function setPauseIcon() {
    $('#player-play i').attr('class', 'fa fa-play');
    $('.player-list-icon').attr('class', 'fa fa-play player-list-icon');
  }

  loadSong(songs[0].locked ? nextPlayable(0, 'next') : 0);

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
    loadSong(nextPlayable(currentIndex, 'prev'));
    audio.play(); isPlaying = true; setPlayIcon();
  });

  $('#player-next').click(function() {
    loadSong(nextPlayable(currentIndex, 'next'));
    audio.play(); isPlaying = true; setPlayIcon();
  });

  $(audio).on('loadedmetadata', function() {
    $('.player-duration').text(formatTime(audio.duration));
  });

  $(audio).on('timeupdate', function() {
    if (audio.duration) {
      $('.player-progress-bar').css('width', (audio.currentTime / audio.duration * 100) + '%');
      $('.player-current').text(formatTime(audio.currentTime));
      $('.player-duration').text(formatTime(audio.duration));
    }
  });

  $(audio).on('ended', function() {
    if (playMode === 2) {
      // 单曲循环
      audio.currentTime = 0;
      audio.play();
    } else if (playMode === 1) {
      // 随机播放
      var playable = [];
      $.each(songs, function(i, s) { if (!s.locked) playable.push(i); });
      var next = playable[Math.floor(Math.random() * playable.length)];
      loadSong(next);
      audio.play();
      setPlayIcon();
    } else {
      // 顺序循环
      loadSong(nextPlayable(currentIndex, 'next'));
      audio.play();
      setPlayIcon();
    }
  });

  var isSeeking = false;
  function seekToX(x, el) {
    if (!audio.duration) return;
    var rect = el.getBoundingClientRect();
    var ratio = Math.min(1, Math.max(0, (x - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    $('.player-progress-bar').css('width', (ratio * 100) + '%');
  }
  $('.player-progress').on('mousedown touchstart', function(e) {
    isSeeking = true;
    var x = e.type === 'touchstart' ? e.originalEvent.touches[0].clientX : e.clientX;
    seekToX(x, this);
  });
  $(document).on('mousemove touchmove', function(e) {
    if (!isSeeking) return;
    var el = $('.player-progress')[0];
    var x = e.type === 'touchmove' ? e.originalEvent.touches[0].clientX : e.clientX;
    seekToX(x, el);
  });
  $(document).on('mouseup touchend', function() {
    isSeeking = false;
  });

  $(document).on('click', '.player-list-item', function() {
    var idx = parseInt($(this).data('index'));
    if (songs[idx].locked) return;
    loadSong(idx);
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
    { title: '待解锁 敬请期待',    audioIndex: 0,  qqUrl: null,                                                              wyyUrl: null, bvid: null,            credit: '',                          cover: null },
    { title: '和自己对话',         audioIndex: 1,  qqUrl: 'https://y.qq.com/n/ryqq_v2/songDetail/000nJmpI403SOX',           wyyUrl: null, bvid: 'BV1La4y1k73i',  credit: 'Cover 林墨',                cover: 'images/covers/02.webp' },
    { title: '样（YOUNG）',        audioIndex: 2,  qqUrl: 'https://y.qq.com/n/ryqq_v2/songDetail/0039tIo02YCRDk',           wyyUrl: null, bvid: 'BV1DT4y1U7qk',  credit: 'Cover TFBOYS',              cover: 'images/covers/03.webp' },
    { title: 'HKVISION LAND',      audioIndex: 3,  qqUrl: 'https://y.qq.com/n/ryqq_v2/songDetail/003e7tMZ37TOlz',           wyyUrl: null, bvid: 'BV1xGUPBrEE2',  credit: '作曲：黄凯/墨绝音',         cover: 'images/covers/04.webp' },
    { title: 'Fall',               audioIndex: 4,  qqUrl: 'https://y.qq.com/n/ryqq_v2/songDetail/003NneXk1XQDxE',           wyyUrl: null, bvid: 'BV1hJ4m187kE',  credit: 'Cover 易烊千玺',            cover: 'images/covers/05.webp' },
    { title: '待解锁 敬请期待',    audioIndex: 5,  qqUrl: null,                                                              wyyUrl: null, bvid: null,            credit: '',                          cover: null },
    { title: '此刻回望',           audioIndex: 6,  qqUrl: 'https://y.qq.com/n/ryqq_v2/songDetail/0021NVdb2kTTug',           wyyUrl: null, bvid: null,            credit: '作曲：黄凯/墨绝音',         cover: 'images/covers/07.webp' },
    { title: '嘿，你还好吗',       audioIndex: 7,  qqUrl: null,                                                              wyyUrl: 'https://music.163.com/#/song?id=2129846924', bvid: 'BV1Y2421c7zN',  credit: 'Cover 钟汉良',  cover: 'images/covers/08.webp' },
    { title: '记录你所给我的一切', audioIndex: 8,  qqUrl: 'https://y.qq.com/n/ryqq_v2/songDetail/000CtRZg3cXzp4',           wyyUrl: null, bvid: 'BV1kTU9YmEPU',  credit: 'Cover 王俊凯',              cover: 'images/covers/09.webp' },
    { title: '此刻着陆',           audioIndex: 9,  qqUrl: 'https://y.qq.com/n/ryqq_v2/songDetail/003Xlxko0aOxLV',           wyyUrl: null, bvid: 'BV1dBGFz6EHa',  credit: '作词：黄凯&emsp;作曲：Sugar', cover: 'images/covers/10.webp' },
    { title: '同乘',               audioIndex: 10, qqUrl: 'https://y.qq.com/',                                               wyyUrl: null, bvid: 'BV1VnS2YSECh',  credit: 'Cover 易烊千玺',            cover: 'images/covers/11.webp' },
    { title: '给未来的自己',       audioIndex: 11, qqUrl: 'https://y.qq.com/n/ryqq_v2/songDetail/002Lq3Td3yzhYe',           wyyUrl: null, bvid: 'BV1jW421P7uY',  credit: 'Cover 梁静茹',              cover: 'images/covers/12.webp' }
  ];

  // 渲染专辑曲目列表
  $.each(albumTracks, function(i, t) {
    var num = (i + 1 < 10 ? '0' : '') + (i + 1);
    var locked = !t.qqUrl && !t.wyyUrl;
    if (locked) {
      $('#album-track-list').append(
        '<li class="album-track-item album-track-locked">' +
        '<span class="album-track-num">🔒</span>' +
        '<span class="album-track-title"><span class="album-track-mystery">待解锁</span><br><small>敬请期待</small></span>' +
        '<span class="album-track-actions"><button class="btn-play-track btn-locked" disabled>🔒</button></span>' +
        '</li>'
      );
    } else {
      var titleText = t.qqUrl
        ? '<a class="album-track-link" href="' + t.qqUrl + '" target="_blank">' + t.title + '</a>'
        : (t.wyyUrl ? '<a class="album-track-link" href="' + t.wyyUrl + '" target="_blank">' + t.title + '</a>' : t.title);
      var titleHtml = titleText + (t.credit ? '<br><small style="color:#aaa;font-size:0.8em">' + t.credit + '</small>' : '');
      var actions = '<button class="btn-play-track" data-audio-index="' + t.audioIndex + '">&#9654;</button>';
      if (t.cover) actions += '<button class="btn-cover" data-cover="' + t.cover + '" data-title="' + t.title + '">🖼️</button>';
      if (t.bvid) actions += '<button class="btn-mv" data-bvid="' + t.bvid + '" data-title="' + t.title + '"><i class="fa fa-film"></i> MV</button>';
      $('#album-track-list').append(
        '<li class="album-track-item">' +
        '<span class="album-track-num">' + num + '</span>' +
        '<span class="album-track-title">' + titleHtml + '</span>' +
        '<span class="album-track-actions">' + actions + '</span>' +
        '</li>'
      );
    }
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

  // 专辑封面翻转
  // 封面双击/双击触摸 切换手绘版
  var lastTapTarget = null, lastTapTime = 0;
  $(document).on('dblclick', '.cover-flip-card', function(e) {
    e.preventDefault();
    $(this).toggleClass('flipped');
  });
  $(document).on('touchend', '.cover-flip-card', function(e) {
    var now = Date.now();
    if (this === lastTapTarget && now - lastTapTime < 300) {
      e.preventDefault();
      $(this).toggleClass('flipped');
      lastTapTime = 0;
    } else {
      lastTapTarget = this;
      lastTapTime = now;
    }
  });
  $('#album-covers-modal').on('show.bs.modal', function() {
    $(this).find('img[data-src]').each(function() {
      $(this).attr('src', $(this).data('src')).removeAttr('data-src');
    });
  });
  $(document).on('mousedown touchstart', '#album-covers-modal .close', function(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    $('#album-covers-modal').modal('hide');
  });


  // 封面弹窗
  $(document).on('click', '.btn-cover', function() {
    $('#cover-modal-title').text($(this).data('title'));
    $('#cover-modal-img').attr('src', $(this).data('cover'));
    $('#cover-modal').modal('show');
  });

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
    { title: 'O.O.O',                       credit: 'Cover 沈小婷',                  bvid: 'BV1Gf4y1A7RG' },
    { title: '我们一起闯',                   credit: 'Cover 林墨',                    bvid: 'BV1mV411E7yK' },
    { title: 'Here I Am',                   credit: 'Cover 井汲大翔',                bvid: 'BV1Ab411f74o' },
    { title: '定格纪念',                     credit: 'Cover 易安音乐社',              bvid: 'BV1RV411Y7KX' },
    { title: '爱你',                         credit: 'Cover 王心凌',                  bvid: 'BV1FF41157S1' },
    { title: '十年之约',                     credit: 'Cover TFBOYS',                 bvid: 'BV1hF411o7YG' },
    { title: 'like JENNIE',                 credit: 'Cover JENNIE',                 bvid: 'BV1y4cFzZEUa' },
    { title: 'Freaky',                      credit: 'Tory Lanez',                   bvid: 'BV19A411w7nH' },
    { title: '告白气球',                     credit: '易烊千玺编舞',                  bvid: 'BV1sE411N7qp' },
    { title: '加油！AMIGO！',               credit: 'Cover TFBOYS',                 bvid: 'BV1JA4y1f78V' },
    { title: '我喜欢你',                     credit: 'Cover 时代少年团',              bvid: 'BV1Mv411u7KP' },
    { title: '绝配',                         credit: 'Cover 时代少年团',              bvid: 'BV18G4y1V7Rp' },
    { title: 'My Boo',                      credit: '易烊千玺',                      bvid: 'BV1Jf4y187MV' },
    { title: '你最最最重要',                  credit: 'Cover 张艺凡',                  bvid: 'BV1pz411i71g' },
    { title: 'Ice',                         credit: 'Cover 王一博',                  bvid: 'BV1gU4y1y7jR' }
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

  // 大事年表 timeline
  var timelineEvents = [
    { year: '2022', events: [
      { date: '03.19', tag: 'music',  tagLabel: '音乐', title: '发布《样（YOUNG）》' },
      { date: '03.19', tag: 'video',  tagLabel: 'MV',   title: '发布《样（YOUNG）》MV' },
      { date: '09.04', tag: 'music',  tagLabel: '音乐', title: '发布《和自己对话》' },
    ]},
    { year: '2023', events: [
      { date: '04.15', tag: 'music',  tagLabel: '音乐', title: '发布《记录你所给我的一切》' },
      { date: '12.21', tag: 'event',  tagLabel: '封面', title: '发布《和自己对话》"双面暗影"单曲封面' },
      { date: '12.22', tag: 'video',  tagLabel: 'MV',   title: '发布《和自己对话》MV' },
    ]},
    { year: '2024', events: [
      { date: '01.01', tag: 'event',  tagLabel: '封面',   title: '发布《和自己对话》"黑白双生"单曲封面' },
      { date: '01.01', tag: 'event',  tagLabel: '封面',   title: '发布《嘿，你还好吗》单曲封面' },
      { date: '02.09', tag: 'video',  tagLabel: 'MV',     title: '发布《嘿，你还好吗》MV' },
      { date: '02.28', tag: 'origin', tagLabel: '音乐', title: '启动《此刻着陆 HKVISION LAND》概念专辑' },
      { date: '02.28', tag: 'event',  tagLabel: '封面',   title: '发布『此刻着陆』"望向银河"封面' },
      { date: '02.28', tag: 'video',  tagLabel: 'MV',     title: '发布《给未来的自己》MV' },
      { date: '03.18', tag: 'video',  tagLabel: 'MV',     title: '发布《Fall》MV' },
      { date: '03.19', tag: 'event',  tagLabel: '封面',   title: '发布《样（YOUNG）》单曲封面' },
      { date: '05.17', tag: 'event',  tagLabel: '封面',   title: '发布《给未来的自己》单曲封面' },
      { date: '05.17', tag: 'event',  tagLabel: '🌟',   title: '发布『此刻着陆』HK面对自我logo' },
      { date: '07.01', tag: 'event',  tagLabel: '封面',   title: '发布『此刻着陆』"望向银河"手绘版封面' },
      { date: '07.07', tag: 'event',  tagLabel: '🌟',   title: '发布『此刻着陆』HK飞行logo' },
      { date: '10.07', tag: 'event',  tagLabel: '封面',   title: '发布《Fall》单曲封面' },
      { date: '10.29', tag: 'event',  tagLabel: '封面',   title: '发布《同乘》单曲封面' },
      { date: '10.29', tag: 'video',  tagLabel: 'MV',     title: '发布《同乘》MV' },
      { date: '11.11', tag: 'event',  tagLabel: '封面',   title: '发布《记录你所给我的一切》"晚星涂鸦"单曲封面' },
      { date: '11.16', tag: 'video',  tagLabel: 'MV',     title: '发布《记录你所给我的一切》MV' },
      { date: '12.07', tag: 'event',  tagLabel: '写真',   title: '发布『此刻着陆』航线—迷幻主人公"暗夜使者"写真' },
    ]},
    { year: '2025', events: [
      { date: '01.01', tag: 'event',  tagLabel: '封面',   title: '发布『此刻着陆』"灿烂如歌"封面' },
      { date: '01.28', tag: 'event',  tagLabel: '写真',   title: '发布『此刻着陆』航线—古城主人公"繁花墨客"写真' },
      { date: '02.10', tag: 'video',  tagLabel: '预告',   title: '发布《此刻着陆》直拍预告' },
      { date: '02.15', tag: 'event',  tagLabel: '封面',   title: '发布『此刻着陆』"灿烂如歌"手绘版封面' },
      { date: '02.17', tag: 'video',  tagLabel: '预告',   title: '发布《此刻着陆》星河闪耀预告' },
      { date: '02.19', tag: 'event',  tagLabel: '封面',   title: '发布『此刻着陆』"漂浮泡沫"封面' },
      { date: '02.20', tag: 'event',  tagLabel: '封面',   title: '发布『此刻着陆』"漂浮泡沫"手绘版封面' },
      { date: '02.22', tag: 'music',  tagLabel: '音乐',   title: '发布《此刻着陆》' },
      { date: '02.22', tag: 'event',  tagLabel: '封面',   title: '发布《此刻着陆》"昼夜双生"手绘封面' },
      { date: '02.22', tag: 'event',  tagLabel: '封面',   title: '发布《此刻着陆》"振翅返航"歌词海报' },
      { date: '02.28', tag: 'event',  tagLabel: '写真',   title: '发布『此刻着陆』航线—摇曳主人公"流苏绅士"写真' },
      { date: '03.02', tag: 'event',  tagLabel: '🌟',     title: '发布《此刻着陆》特别祝福篇《此刻庆祝》' },
      { date: '03.18', tag: 'event',  tagLabel: '写真',   title: '发布『此刻着陆』航线—宫阙主人公"盛世公子"写真' },
      { date: '03.19', tag: 'event',  tagLabel: '封面',   title: '发布《记录你所给我的一切》"三生三世"单曲封面' },
      { date: '05.06', tag: 'event',  tagLabel: '写真',   title: '发布『此刻着陆』航线—光明主人公"羽翼少年"写真' },
      { date: '06.28', tag: 'event',  tagLabel: '写真',   title: '发布『此刻着陆』航线—野兽主人公"貂皮射手"写真' },
      { date: '07.01', tag: 'video',  tagLabel: '预告',   title: '发布《此刻着陆》MV Teaser' },
      { date: '07.05', tag: 'event',  tagLabel: '封面',   title: '发布《此刻着陆》MV沙画封面' },
      { date: '07.05', tag: 'video',  tagLabel: 'MV',     title: '《此刻着陆》MV点映礼' },
      { date: '07.06', tag: 'video',  tagLabel: 'MV',     title: '发布《此刻着陆》MV' },
      { date: '08.03', tag: 'dance',  tagLabel: '舞蹈',   title: '发布《此刻着陆》Dance Break' },
      { date: '08.08', tag: 'dance',  tagLabel: '舞蹈',   title: '发布《此刻着陆》手势舞' },
      { date: '08.09', tag: 'music',  tagLabel: '音乐',   title: '发布《此刻着陆》打歌舞台' },
      { date: '08.13', tag: 'dance',  tagLabel: '舞蹈',   title: '发布《此刻着陆》Dance Break 及手势舞分解教程' },
      { date: '08.28', tag: 'music',  tagLabel: '音乐',   title: '发布《此刻回望》' },
      { date: '10.02', tag: 'music',  tagLabel: '音乐',   title: '发布《此刻着陆》架子鼓' },
      { date: '11.23', tag: 'video',  tagLabel: 'MV',     title: '发布《HKVISION LAND》MV' },
      { date: '11.28', tag: 'music',  tagLabel: '音乐',   title: '发布《HKVISION LAND》' },
      { date: '12.01', tag: 'origin', tagLabel: '音乐', title: '发布《此刻着陆 HKVISION LAND》典藏Live辑《此刻闪耀》' },
    ]},
  ];

  (function() {
    var $tl = $('#hkv-timeline');
    if (!$tl.length) return;
    var tagClass = { music: 'tl-tag-music', video: 'tl-tag-video', event: 'tl-tag-event', origin: 'tl-tag-origin', dance: 'tl-tag-dance' };
    $tl.append('<div class="tl-ending tl-ending-top">此刻着陆 &nbsp;无限精彩</div>');
    $.each(timelineEvents.slice().reverse(), function(i, group) {
      var groupId = 'tl-group-' + group.year;
      $tl.append(
        '<div class="tl-year-header" data-target="#' + groupId + '">' +
          '<div class="tl-year-label">' + group.year + '</div>' +
          '<div class="tl-year-line"></div>' +
          '<span class="tl-toggle"><i class="fa fa-chevron-up"></i></span>' +
        '</div>'
      );
      var $group = $('<div class="tl-group" id="' + groupId + '"></div>');
      var dateOrder = [], byDate = {};
      $.each(group.events, function(j, e) {
        if (!byDate[e.date]) { byDate[e.date] = []; dateOrder.push(e.date); }
        byDate[e.date].push(e);
      });
      var sortedEvents = [];
      $.each(dateOrder.slice().reverse(), function(j, d) {
        $.each(byDate[d], function(k, e) { sortedEvents.push(e); });
      });
      var lastDate = null;
      $.each(sortedEvents, function(j, e) {
        var showDate = e.date !== lastDate;
        lastDate = e.date;
        $group.append(
          '<div class="tl-item">' +
            '<div class="tl-date">' + (showDate ? e.date : '') + '</div>' +
            '<div class="tl-dot"></div>' +
            '<div class="tl-content">' +
              '<span class="tl-tag ' + (tagClass[e.tag] || '') + '">' + e.tagLabel + '</span>' +
              '<div class="tl-title">' + e.title + '</div>' +
              (e.desc ? '<div class="tl-desc">' + e.desc + '</div>' : '') +
            '</div>' +
          '</div>'
        );
      });
      $tl.append($group);
    });
    $tl.on('click', '.tl-year-header', function() {
      var $header = $(this);
      var $group = $($header.data('target'));
      var collapsed = $group.hasClass('tl-collapsed');
      $group.toggleClass('tl-collapsed');
      $header.find('.fa').toggleClass('fa-chevron-up', collapsed).toggleClass('fa-chevron-down', !collapsed);
    });
    $tl.append(
      '<div class="tl-ending">HKVISION LAND</div>'
    );
  })();

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




// ── 抽卡系统 ──
(function() {
  var rarityLabel = { R:'R', SR:'SR', SSR:'SSR' };
  // 稀有度权重：数值越大越容易抽到
  var rarityWeight = { R: 60, SR: 30, SSR: 10 };
  var allCards = [
    { img:'images/samples/kaihuang.jpg',      rarity:'SSR' },
    { img:'images/samples/hk.jpg',            rarity:'SR'  },
    { img:'images/samples/chongyang.jpg',     rarity:'SR'  },
    { img:'images/samples/0903.jpg',          rarity:'R'   },
    { img:'images/samples/1014433248.jpg',    rarity:'R'   },
    { img:'images/samples/1375092296.jpg',    rarity:'R'   },
    { img:'images/samples/1850647824.jpg',    rarity:'R'   },
    { img:'images/samples/hole.jpg',          rarity:'R'   },
    { img:'images/samples/kaihuang photo.jpg',rarity:'R'   }
  ];
  var MAX_DRAWS = 10;
  var rarityOrder = { SSR: 0, SR: 1, R: 2 };
  var drawCount = 0;
  var collected = {}; // key: img → { rarity, count }

  // 有放回加权随机
  function weightedPick() {
    var total = allCards.reduce(function(s, c) { return s + rarityWeight[c.rarity]; }, 0);
    var r = Math.random() * total;
    var cum = 0;
    for (var i = 0; i < allCards.length; i++) {
      cum += rarityWeight[allCards[i].rarity];
      if (r < cum) return allCards[i];
    }
    return allCards[allCards.length - 1];
  }

  function renderDeck() {
    var $stack = $('#draw-deck-stack');
    $stack.empty();
    var rots = [-10, -5, 0, 5, 10];
    var yOff = [4, 2, 0, 2, 4];
    for (var i = 0; i < 5; i++) {
      $('<div class="draw-card-back"></div>')
        .css('transform', 'rotate(' + rots[i] + 'deg) translateY(' + yOff[i] + 'px)')
        .css('z-index', i)
        .appendTo($stack);
    }
    $('#draw-deck-count').text('');
  }

  function initDraw() {
    drawCount = 0;
    collected = {};
    $('#draw-card-slot').html('<div class="draw-hint">✦<br>揭开你的<br>此刻主人公</div>');
    $('#draw-rarity-badge').text('').removeClass('visible draw-rarity-R draw-rarity-SR draw-rarity-SSR');
    $('#draw-collection').empty();
    $('#draw-counter').text('已抽 0 / ' + MAX_DRAWS + ' · 拥有 0 / ' + allCards.length);
    $('#draw-btn').prop('disabled', false).html('<img src="images/HKVISIONLAND.png" class="draw-btn-logo">');
    renderDeck();
  }

  $('#photo-draw-modal').on('show.bs.modal', function() { initDraw(); });

  // 收藏大图 lightbox
  var $lb = $('<div id="draw-lightbox"><img id="draw-lb-img"><div id="draw-lb-rarity"></div></div>').appendTo('body');
  $lb.on('click', function() { $lb.removeClass('active'); });
  $(document).on('click', '.draw-thumb-wrap', function() {
    var src = $(this).find('img').attr('src');
    var rarity = $(this).data('rarity');
    $('#draw-lb-img').attr('src', src);
    $('#draw-lb-rarity').text(rarityLabel[rarity]).attr('class', 'draw-lb-rarity-' + rarity);
    $lb.addClass('active');
  });

  $(document).on('click', '#draw-btn', function() {
    var $btn = $(this);
    $btn.prop('disabled', true);

    // 1. shake deck
    var $stack = $('#draw-deck-stack');
    $stack.addClass('shaking');

    setTimeout(function() {
      $stack.removeClass('shaking');
      // 2. deal top card animation
      $stack.find('.draw-card-back').last().addClass('dealing');

      setTimeout(function() {
        var card = weightedPick();
        drawCount++;
        renderDeck();

        // 3. reveal in slot
        var $slot = $('#draw-card-slot');
        $slot.empty().css('border-color', '').css('box-shadow', '');
        $('<img class="draw-card-revealed">').attr('src', card.img).appendTo($slot);

        // 4. rarity badge
        var $badge = $('#draw-rarity-badge');
        $badge.removeClass('visible draw-rarity-R draw-rarity-SR draw-rarity-SSR');
        $badge.text(rarityLabel[card.rarity]).addClass('draw-rarity-' + card.rarity);
        setTimeout(function() { $badge.addClass('visible'); }, 50);

        // 5. border color by rarity
        var colors = { R:'#3a7bd5', SR:'#8840d0', SSR:'#c8960a' };
        $slot.css('border-color', colors[card.rarity]);
        if (card.rarity === 'SSR') $slot.css('box-shadow', '0 0 24px rgba(200,150,10,0.6)');
        else if (card.rarity === 'SR') $slot.css('box-shadow', '0 0 14px rgba(136,64,208,0.4)');

        // 6. 收藏：重复则更新次数，否则新增
        if (collected[card.img]) {
          collected[card.img].count++;
          $('#draw-collection').find('[data-img="' + card.img + '"] .draw-thumb-count')
            .text('×' + collected[card.img].count);
        } else {
          collected[card.img] = { rarity: card.rarity, count: 1 };
          var $wrap = $('<div class="draw-thumb-wrap">').attr('data-img', card.img).attr('data-rarity', card.rarity);
          $('<img class="draw-thumb draw-thumb-' + card.rarity + '">')
            .attr('src', card.img).attr('title', rarityLabel[card.rarity]).appendTo($wrap);
          $('<span class="draw-thumb-count">').appendTo($wrap);
          $('<span class="draw-thumb-rarity draw-thumb-rarity-' + card.rarity + '">').text(rarityLabel[card.rarity]).appendTo($wrap);
          $('#draw-collection').append($wrap);
          // 按稀有度排序：SSR > SR > R
          $('#draw-collection').children('.draw-thumb-wrap').sort(function(a, b) {
            return rarityOrder[$(a).data('rarity')] - rarityOrder[$(b).data('rarity')];
          }).appendTo('#draw-collection');
          setTimeout(function() { $wrap.addClass('show'); }, 50);
        }

        // 7. counter
        var uniqueCount = Object.keys(collected).length;
        $('#draw-counter').text('已抽 ' + drawCount + ' / ' + MAX_DRAWS + ' · 拥有 ' + uniqueCount + ' / ' + allCards.length);

        // 8. 达到上限则禁用，否则重新启用
        if (drawCount >= MAX_DRAWS) {
          $btn.prop('disabled', true).html('✦ 此刻着陆 ✦');
        } else {
          setTimeout(function() { $btn.prop('disabled', false); }, 400);
        }
      }, 380);
    }, 100);
  });
})();

// 弹窗打开时禁止背景页面滚动（移动端）
$(document).on('show.bs.modal', '.modal', function() {
  $(document).on('touchmove.modallock', function(e) {
    if (!$(e.target).closest('.modal-dialog').length) {
      e.preventDefault();
    }
  });
}).on('hidden.bs.modal', '.modal', function() {
  $(document).off('touchmove.modallock');
});

$('.carousel').swipe( {
     swipeLeft: function() {
         $(this).carousel('next');
     },
     swipeRight: function() {
         $(this).carousel('prev');
     },
     allowPageScroll: 'vertical'
 });



