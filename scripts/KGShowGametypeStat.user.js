// ==UserScript==
// @name            KGShowGametypeStat.user.js
// @namespace       klavogonki
// @include         http*://klavogonki.ru/g/*
// @author          Voronov/JustSo
// @version         0.1.0
// @description     Counts the number of races and create gametype stat link
// @icon            https://i.imgur.com/w8pvv3n.jpg
// ==/UserScript==

;
window.addEventListener('load', function() {
  if (document.getElementById('racer-mode-stat')) return;

  run();

  function run() {
    var protocol = location.protocol;
    var racerId = getUserId();
    var gameType = game.getGametype();

    fetchNumOfRaces(protocol, racerId, gameType)
      .then(function(numOfRaces) {
        insertInfo(protocol, racerId, gameType, numOfRaces);
      });
  }

  function insertInfo(protocol, racerId, gameType, numOfRaces) {
    var paramsBlock = document.querySelector('#params table:last-child');
    var elem = document.createElement('div');
    elem.id = 'racer-mode-stat';
    elem.style.setProperty('text-align', 'left', null);
    elem.innerHTML = `
      <span>Сегодня: ${numOfRaces}</span>
      <span style="margin-left: 15px;">
        <a href="${protocol}//klavogonki.ru/u/#/${racerId}/stats/${gameType}">Статистика</a>
      </span>
    `;
    paramsBlock.parentNode.insertBefore(elem, params.nextSibling);
  }

  function fetchNumOfRaces(protocol, racerId, gameType) {
    var url = getUrl(protocol, racerId, gameType);

    return fetch(url)
      .then(function(res) { return res.json() })
      .then(function(data) { return data && data.list && data.list[0].cnt || 0 });
  }


  function getUrl(protocol, racerId, gameType) {
    var today = new Date();
    var day = String(today.getUTCDate()).padStart(2, '0');
    var month = String(today.getUTCMonth() + 1).padStart(2, '0');
    var year = today.getUTCFullYear();
    today = [year, month, day].join('-');

    var url = `${protocol}//klavogonki.ru` +
      `/api/profile/get-stats-details-data?` +
      `userId=${racerId}` +
      `&gametype=${gameType}` +
      `&fromDate=${today}` +
      `&toDate=${today}` +
      `&grouping=day`;
    return url;
  }

  function getUserId() {
    var userBlock = document.getElementsByClassName('user-block')[0];
    if (!userBlock) return 0;
    return userBlock.getElementsByClassName('btn')[0].href.split('/').slice(-2)[0];
  }
}, false);
