$(function() {

    var bootstrapper;
    var isFullSreen = false;

    var $header = $('header');
    var $manifest = $('#manifest');
    var $main = $('main');
    var $uv = $('#uv');
    var $footer = $('footer');

    var GACategories = {
        interactions: "Interactions",
        files: "Files"
    };

    window.onresize = function() {
        resize();
    };

    function resize() {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var height = (isFullSreen) ? windowHeight : windowHeight - $header.outerHeight();
        $main.height(height);
        $main.width(windowWidth);
        $uv.width(windowWidth);
        $uv.height(height);
    }
    
    resize();

    function loadViewer() {

        // todo: update embed.js to work with script loaders.
        if (window.initPlayers && window.easyXDM) {
            initPlayers($('.uv'));
        } else {
            setTimeout(loadViewer, 100);
        }
    }

    function isIE8(){
        return (browserDetect.browser === 'Explorer' && browserDetect.version === 8);
    }

    function reload() {

        var manifest = $('#manifest').val();

        // clear hash params
        clearHashParams();

        var qs = document.location.search.replace('?', '');
        qs = Utils.Urls.UpdateURIKeyValuePair(qs, 'manifest', manifest);

        if (window.location.search === '?' + qs){
            window.location.reload();
        } else {
            window.location.search = qs;
        }
    }

    function clearHashParams(){
        document.location.hash = '';
    }

    function setSelectedManifest(manifestUri){

        if (!manifestUri){
            manifestUri = Utils.Urls.GetQuerystringParameter('manifest');
        }

        if (manifestUri) {
            $('#manifest').val(manifestUri);
            updateDragDrop();

            $('.uv').attr('data-uri', manifestUri);
        }
    }

    function updateDragDrop(){
        $('#dragndrop').attr('href', location.origin + location.pathname + '?manifest=' + $('#manifest').val());
    }

    function uvEventHandlers() {

        $(document).bind('uv.onDrop', function (event, manifestUri) {
            console.log('uv.drop: ' + manifestUri);
            clearHashParams();
        });

        $(document).bind('uv.onLoad', function (event, obj) {

            bootstrapper = obj.bootstrapper;
            var locales = bootstrapper.config.localisation.locales;
            var manifestUri = bootstrapper.params.manifestUri;

            trackEvent(items, 'Viewed', manifestUri);
            trackVariable(1, 'Viewing', manifestUri, 2);

            $('#locale').empty();

            for (var i = 0; i < locales.length; i++){
                var l = locales[i];
                $('#locale').append('<option value="' + l.name + '">' + l.label + '</option>');
            }
        });

        $(document).bind('uv.onNotFound', function (event, obj) {
            console.log('uv.onNotFound');
        });

        $(document).bind('uv.onToggleFullScreen', function (event, obj) {
            isFullSreen = obj.isFullScreen;
        });

        $(document).bind('uv.onCreated', function (event, obj) {

        });

        $(document).bind('uv.onHideLoginDialogue', function (event, obj) {
            trackEvent(GACategories.interactions, 'Log in', 'Closed');
        });

        $(document).bind('uv.onHideEmbedDialogue', function (event, obj) {
            trackEvent(GACategories.interactions, 'Embed', 'Closed');
        });

        $(document).bind('uv.onHideDownloadDialogue', function (event, obj) {
            trackEvent(GACategories.interactions, 'Download', 'Closed');
        });

        $(document).bind('uv.onShowLoginDialogue', function (event, obj) {
            trackEvent(GACategories.interactions, 'Log in', 'Opened');
        });

        $(document).bind('uv.onViewFullTerms', function (event, obj) {
            trackEvent(GACategories.interactions, 'Ts & Cs', 'Viewed');
        });

        $(document).bind('uv.onExternalLinkClicked', function (event, url) {
            if (url.indexOf('terms-and-conditions') != -1){
                trackEvent(GACategories.interactions, 'Ts & Cs', 'Viewed');
            }
        });

        $(document).bind('uv.onAcceptTerms', function (event, obj) {
            trackEvent(GACategories.interactions, 'Ts & Cs', 'Accepted');
        });

        $(document).bind('uv.onShowDownloadDialogue', function (event, obj) {
            trackEvent(GACategories.interactions, 'Download', 'Opened');
        });

        $(document).bind('seadragonExtension.onDownloadCurrentView', function (event, obj) {
            trackEvent(GACategories.files, 'Downloaded - Current View');
        });

        $(document).bind('seadragonExtension.onDownloadWholeImageHighRes', function (event, obj) {
            trackEvent(GACategories.files, 'Downloaded - Whole Image High Res');
        });

        $(document).bind('seadragonExtension.onDownloadWholeImageLowRes', function (event, obj) {
            trackEvent(GACategories.files, 'Downloaded - Whole Image Low Res');
        });

        $(document).bind('seadragonExtension.onDownloadEntireDocumentAsPDF', function (event, obj) {
            trackEvent(GACategories.files, 'Downloaded - Entire Document As PDF');
        });

        $(document).bind('seadragonExtension.onDownloadEntireDocumentAsText', function (event, obj) {
            trackEvent(GACategories.files, 'Downloaded - Entire Document As Text');
        });

        $(document).bind('uv.onShowEmbedDialogue', function (event, obj) {
            trackEvent(GACategories.interactions, 'Embed', 'Opened');
        });

        $(document).bind('uv.onToggleFullScreen', function (event, obj) {
            if (obj.isFullScreen) {
                trackEvent(GACategories.interactions, 'Full Screen', 'Enter');
            } else {
                trackEvent(GACategories.interactions, 'Full Screen', 'Exit');
            }
        });

        $(document).bind('uv.onOpenLeftPanel', function (event, obj) {
            trackEvent(GACategories.interactions, 'Left Panel', 'Opened');
        });

        $(document).bind('uv.onCloseLeftPanel', function (event, obj) {
            trackEvent(GACategories.interactions, 'Left Panel', 'Closed');
        });

        $(document).bind('seadragonExtension.onOpenTreeView', function (event, obj) {
            trackEvent(GACategories.interactions, 'Tree', 'Opened');
        });

        $(document).bind('seadragonExtension.onOpenThumbsView', function (event, obj) {
            trackEvent(GACategories.interactions, 'Thumbs', 'Opened');
        });

        $(document).bind('uv.onOpenRightPanel', function (event, obj) {
            trackEvent(GACategories.interactions, 'Right Panel', 'Opened');
        });

        $(document).bind('uv.onCloseRightPanel', function (event, obj) {
            trackEvent(GACategories.interactions, 'Right Panel', 'Closed');
        });

        $(document).bind('mediaelementExtension.onMediaPlayed', function (event, obj) {
            trackEvent(GACategories.interactions, 'Play');
        });

        $(document).bind('mediaelementExtension.onMediaPaused', function (event, obj) {
            trackEvent(GACategories.interactions, 'Pause');
        });

        $(document).bind('mediaelementExtension.onMediaEnded', function (event, obj) {
            trackEvent(GACategories.interactions, 'Ended');
        });
    }

    function trackEvent(category, action, label) {
        _gaq.push(['_trackEvent', category, action, label]);
    }

    /**
     * @param {number} slot - 1-5 (5 slots per scope)
     * @param {string} name - the name for the custom variable
     * @param {number} value - the value of the custom variable
     * @param {string} scope - visitor, session, page
     */
    function trackVariable(slot, name, value, scope) {
        _gaq.push(['_setCustomVar', Number(slot), name, value, Number(scope)]);
    }

    function init() {

        // append uv script
        if (isLocalhost){
            if (!scriptIncluded) $('body').append('<script type="text/javascript" id="embedUV" src="/src/lib/embed.js"><\/script>');
        } else {
            $('body').append('<script type="text/javascript" id="embedUV" src="/uv/lib/embed.js"><\/script>');
        }

        // add data-config attribute to uv
        var configPath = "/config.json";

        if (isLocalhost){
            configPath = '/examples' + configPath;
        }

        $uv.attr('data-config', configPath);

        $('#manifestSelect').on('change', function(){
            $('#manifest').val($('#manifestSelect option:selected').val());
            updateDragDrop();
        });

        $('#setManifestBtn').on('click', function(e){
            e.preventDefault();
            reload();
        });

        $manifest.on('drop', function(e) {
            e.preventDefault();
            var dropUrl = e.originalEvent.dataTransfer.getData("URL");
            var url = Utils.Urls.GetUrlParts(dropUrl);
            var manifestUri = Utils.Urls.GetQuerystringParameterFromString('manifest', url.search);
            //var canvasUri = Utils.Urls.GetQuerystringParameterFromString('canvas', url.search);

            if (manifestUri){
                setSelectedManifest(manifestUri);
                reload();
            }
        });

        $manifest.on('dragover', function(e) {
            // allow drop
            e.preventDefault();
        });

        $manifest.click(function() {
            $(this).select();
        });

        uvEventHandlers();

        setSelectedManifest();

        loadViewer();
    }

    var isLocalhost = document.location.href.indexOf('localhost') != -1;

    // if the embed script has been included in the page for testing, don't append it.
    var scriptIncluded = $('#embedUV').length;

    init();
});
