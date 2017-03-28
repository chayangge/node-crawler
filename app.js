var fs = require("fs");
var path = require("path");
var cheerio = require("cheerio");
var superagent = require("superagent");
var http = require("http");
var sleep = require('system-sleep');
// var sleep = require("sleep");
var async = require("async");

var wechat_id = process.argv[2];
console.log(wechat_id)
var url = "http://chuansong.me/account/" + wechat_id;
var articleList = {};
var pageList = {};

function getPage(url) {
    // sleep.sleep(1)
    sleep(1000)
    superagent.get(url)
        .set('Cookie', 'pac_uid=1_296961962; tvfe_boss_uuid=fa639707d46a593a; gaduid=57e233c12e361; ts_uid=7972323162; 3g_guest_id=-8959557366479556608; sd_userid=2221479884684448; sd_cookie_crttime=1479884684448; mobileUV=1_159532ed952_608ef; noticeLoginFlag=1; remember_acct=chuanjinw%40sina.com; pgv_pvi=6468546560; RK=sTuKTBHLcq; ptcz=914f54747dd08a9cd8494895a874333736c85055c8ce787a519d62d0a4d9b216; pt2gguin=o0296961962; o_cookie=296961962; pgv_info=ssid=s291503616; pgv_pvid=3796909651')
        .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36')
        .set('Accept-Language', 'zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4,zh-TW;q=0.2')
        .set('Connection', 'keep-alive')
        .set('Accept-Encoding', 'gzip, deflate, sdch')
        .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
        .end(function(err, result) {
            fs.access("result", function(err) {
                if (err != null) {
                    fs.mkdir(wechat_id, function(err, files) {
                        fs.writeFile('./result/aaa.html', result.text);
                    });
                } else {
                    fs.mkdir(wechat_id, function(err, files) {
                        // fs.writeFile('./result/aaa.html', result.text);

                        var $ = cheerio.load(result.text, {
                            decodeEntities: false
                        });
                        var pages = $(".w4_5 > span > a"); //.html();
                        var articles = $(".question_link");

                        articles.each(function(id, article) {
                            var url = $(article).attr("href");
                            if (articleList[url] == null) {
                                articleList[url] = "http://chuansong.me" + url;
                                sleep(1000)
                                getArticle("http://chuansong.me" + url)
                            }
                        });
                        // console.log(articleList)
                        // send()

                        pages.each(function(id, element) {
                            var url = $(element).attr("href");
                            if (pageList[url] == null) {
                                pageList[url] = "http://chuansong.me" + url;

                                sleep(1100)
                                getPage("http://chuansong.me" + url);
                            }
                        });
                    });
                    // fs.writeFile(wechat_id + '/aaa.html', result.text);

                }
            });
        });
}


function getArticle(url) {
    // sleep.sleep(1)
    sleep(1000)
    superagent.get(url)
        .set('Cookie', 'pac_uid=1_296961962; tvfe_boss_uuid=fa639707d46a593a; gaduid=57e233c12e361; ts_uid=7972323162; 3g_guest_id=-8959557366479556608; sd_userid=2221479884684448; sd_cookie_crttime=1479884684448; mobileUV=1_159532ed952_608ef; noticeLoginFlag=1; remember_acct=chuanjinw%40sina.com; pgv_pvi=6468546560; RK=sTuKTBHLcq; ptcz=914f54747dd08a9cd8494895a874333736c85055c8ce787a519d62d0a4d9b216; pt2gguin=o0296961962; o_cookie=296961962; pgv_info=ssid=s291503616; pgv_pvid=3796909651')
        .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36')
        .set('Accept-Language', 'zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4,zh-TW;q=0.2')
        .set('Connection', 'keep-alive')
        .set('Accept-Encoding', 'gzip, deflate, sdch')
        .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
        .end(function(err, result) {
            if (err != null) {
                console.log(err);
                return;
            }

            var $ = cheerio.load(result.text, {
                decodeEntities: false
            });
            var name = $("#activity-name").html().trim();
            name = name.replace(/\//, " ");
            console.log(name)
            var textEle = $(".rich_media_content > p");
            fs.appendFile("./" + wechat_id + '/' + name, name + "\n \n");

            textEle.each(function(id, article) {
                var text = $(article).text();
                fs.appendFile("./" + wechat_id + '/' + name, text + "\n");
            });
            sleep(300)

        });
    sleep(300)
}



getPage(url)

// http.createServer(start).listen(9000);