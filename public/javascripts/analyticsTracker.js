(function () {
    var trackingId = 'UA-136826603-1';
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', trackingId, 'auto', {
        'name': 'analyticsTracker'
    });

    (function initialPageview() {
        ga(function () {
            var tracker = ga.getByName('analyticsTracker');
            var clientId = tracker.get('clientId');
            var sessionId = (new Date).getTime() + "." + Math.random().toString(36).substring(5);
            
            ga('analyticsTracker.set', 'dimension1', clientId);
            ga('analyticsTracker.set', 'dimension2', sessionId);
            ga('analyticsTracker.set', 'transport', 'beacon');
            ga('analyticsTracker.set', 'anonymizeIp', true);
      
            ga('analyticsTracker.send', 'pageview');
      
          });
    })();
})();