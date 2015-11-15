$(function() {

    var bootstrapper, editor;
    //var uvVersion = 'uv-1.5.26';
    var uvVersion = 'uv';

    function loadViewer() {

        // todo: update embed.js to work with script loaders.
        if (window.initPlayers && window.easyXDM) {
            initPlayers($('.uv'));
        } else {
            setTimeout(loadViewer, 100);
        }
    }

    function loadManifests(cb) {
        var manifestsUri = '/manifests.json';

        if (!isLocalhost){
            manifestsUri = '/universalviewer-io/manifests.json'
        }

        // load manifests
        $.getJSON(manifestsUri, function(manifests){

            var $manifestSelect = $('#manifestSelect');

            for (var i = 0; i < manifests.collections.length; i++) {
                var collection = manifests.collections[i];

                $manifestSelect.append('<optgroup label="' + collection.label + '">');

                for (var j = 0; j < collection.manifests.length; j++){
                    var manifest = collection.manifests[j];

                    if (manifest.visible !== false){
                        $manifestSelect.append('<option value="' + manifest['@id'] + '">' + manifest.label + '</option>');
                    }
                }

                $manifestSelect.append('</optgroup>');
            }

            cb();
        });
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

    function setSelectedManifest(){

        var manifest = Utils.Urls.GetQuerystringParameter('manifest');

        if (manifest) {
            $('#manifestSelect').val(manifest);
        } else {
            var options = $('#manifestSelect option');

            if (options.length){
                manifest = options[0].value;
            }
        }

        $('#manifest').val(manifest);
        updateDragDrop();

        $('.uv').attr('data-uri', manifest);
    }

    function updateDragDrop(){
        $('#dragndrop').attr('href', location.origin + location.pathname + '?manifest=' + $('#manifest').val());
    }

    function uvEventHandlers() {

        $(document).bind('uv.onAuthorizationOccurred', function (event, obj) {
            console.log('uv.onAuthorizationOccurred');
        });

        $(document).bind('uv.onCanvasIndexChangeFailed', function (event, obj) {
            console.log('uv.onCanvasIndexChangeFailed');
        });

        $(document).bind('uv.onCanvasIndexChanged', function (event, obj) {
            console.log('uv.onCanvasIndexChanged', obj);
        });

        $(document).bind('uv.onClickthroughOccurred', function (event, obj) {
            console.log('uv.onClickthroughOccurred');
        });

        $(document).bind('uv.onCloseActiveDialogue', function (event, obj) {
            console.log('uv.onCloseActiveDialogue');
        });

        $(document).bind('uv.onCloseLeftPanel', function (event, obj) {
            console.log('uv.onCloseLeftPanel');
        });

        $(document).bind('uv.onCloseRightPanel', function (event, obj) {
            console.log('uv.onCloseRightPanel');
        });

        $(document).bind('uv.onCreated', function (event, obj) {
            console.log('uv.onCreated');
            setTestIds();
        });

        $(document).bind('uv.onDownArrow', function (event, obj) {
            console.log('uv.onDownArrow');
        });

        $(document).bind('uv.onDownload', function (event, obj) {
            console.log('uv.onDownload', obj);
        });

        $(document).bind('uv.onDrop', function (event, manifestUri) {
            console.log('uv.drop: ' + manifestUri);
            clearHashParams();
        });

        $(document).bind('uv.onEnd', function (event, obj) {
            console.log('uv.onEnd');
        });

        $(document).bind('uv.onEscape', function (event, obj) {
            console.log('uv.onEscape');
        });

        $(document).bind('uv.onHideDownloadDialogue', function (event, obj) {
            // uv uses onHideOverlay
            console.log('uv.onHideDownloadDialogue');
        });

        $(document).bind('uv.onHideEmbedDialogue', function (event, obj) {
            // uv uses onHideOverlay
            console.log('uv.onHideEmbedDialogue');
        });

        $(document).bind('uv.onHideExternalContentDialogue', function (event, obj) {
            console.log('uv.onHideExternalContentDialogue');
        });

        $(document).bind('uv.onHideGenericDialogue', function (event, obj) {
            // uv uses onHideOverlay
            console.log('uv.onHideGenericDialogue');
        });

        $(document).bind('uv.onHideInformation', function (event, obj) {
            console.log('uv.onHideInformation');
        });

        $(document).bind('uv.onHideOverlay', function (event, obj) {
            console.log('uv.onHideOverlay');
        });

        $(document).bind('uv.onHideSettingsDialogue', function (event, obj) {
            // uv uses onHideOverlay
            console.log('uv.onHideSettingsDialogue');
        });

        $(document).bind('uv.onHome', function (event, obj) {
            console.log('uv.onHome');
        });

        $(document).bind('uv.onLeftArrow', function (event, obj) {
            console.log('uv.onLeftArrow');
        });

        $(document).bind('uv.onLeftPanelCollapseFullFinish', function (event, obj) {
            console.log('uv.onLeftPanelCollapseFullFinish');
        });

        $(document).bind('uv.onLeftPanelCollapseFullStart', function (event, obj) {
            console.log('uv.onLeftPanelCollapseFullStart');
        });

        $(document).bind('uv.onLeftPanelExpandFullFinish', function (event, obj) {
            console.log('uv.onLeftPanelExpandFullFinish');
        });

        $(document).bind('uv.onLeftPanelExpandFullStart', function (event, obj) {
            console.log('uv.onLeftPanelExpandFullStart');
        });

        $(document).bind('uv.onLoad', function (event, obj) {

            console.log('uv.onLoad', obj);

            closeEditor();

            bootstrapper = obj.bootstrapper;
            var locales = bootstrapper.config.localisation.locales;

            $('#locale').empty();

            for (var i = 0; i < locales.length; i++){
                var l = locales[i];
                $('#locale').append('<option value="' + l.name + '">' + l.label + '</option>');
            }

            setSelectedLocale(bootstrapper.params.locale);

            loadConfigSchema(function(schema) {
                if (schema){
                    createEditor(schema);
                    if (!isIE8()) {
                        $('#configEditor').show();
                    }
                }
                $('footer').show();
            });
        });

        $(document).bind('uv.onNotFound', function (event, obj) {
            console.log('uv.onNotFound');
        });

        $(document).bind('uv.onOpenLeftPanel', function (event, obj) {
            console.log('uv.onOpenLeftPanel');
        });

        $(document).bind('uv.onOpenExternalResource', function (event, obj) {
            console.log('uv.onOpenExternalResource');
        });

        $(document).bind('uv.onOpenRightPanel', function (event, obj) {
            console.log('uv.onOpenRightPanel');
        });

        $(document).bind('uv.onPageDown', function (event, obj) {
            console.log('uv.onPageDown');
        });

        $(document).bind('uv.onPageUp', function (event, obj) {
            console.log('uv.onPageUp');
        });

        $(document).bind('uv.onRedirect', function (event, obj) {
            console.log('uv.onRedirect');
        });

        $(document).bind('uv.onRefresh', function (event, obj) {
            console.log('uv.onRefresh');
        });

        $(document).bind('uv.onResourceDegraded', function (event, obj) {
            console.log('uv.onResourceDegraded');
        });

        $(document).bind('uv.onReturn', function (event, obj) {
            console.log('uv.onReturn');
        });

        $(document).bind('uv.onRightArrow', function (event, obj) {
            console.log('uv.onRightArrow');
        });

        $(document).bind('uv.onRightPanelCollapseFullFinish', function (event, obj) {
            console.log('uv.onRightPanelCollapseFullFinish');
        });

        $(document).bind('uv.onRightPanelCollapseFullStart', function (event, obj) {
            console.log('uv.onRightPanelCollapseFullStart');
        });

        $(document).bind('uv.onRightPanelExpandFullFinish', function (event, obj) {
            console.log('uv.onRightPanelExpandFullFinish');
        });

        $(document).bind('uv.onRightPanelExpandFullStart', function (event, obj) {
            console.log('uv.onRightPanelExpandFullStart');
        });

        $(document).bind('uv.onSequenceIndexChanged', function (event, sequenceIndex) {
            console.log('uv.onSequenceIndexChanged: ' + sequenceIndex);
        });

        $(document).bind('uv.onSettingsChanged', function (event, settings) {
            console.log('uv.onSettingsChanged', settings);
        });

        $(document).bind('uv.onShowClickThroughDialogue', function (event, obj) {
            console.log('uv.onShowClickThroughDialogue');
        });

        $(document).bind('uv.onShowDownloadDialogue', function (event, obj) {
            console.log('uv.onShowDownloadDialogue');
        });

        $(document).bind('uv.onShowEmbedDialogue', function (event, obj) {
            console.log('uv.onShowEmbedDialogue');
        });

        $(document).bind('uv.onShowExternalContentDialogue', function (event, obj) {
            console.log('uv.onShowExternalContentDialogue');
        });

        $(document).bind('uv.onShowGenericDialogue', function (event, obj) {
            console.log('uv.onShowGenericDialogue');
        });

        $(document).bind('uv.onShowHelpDialogue', function (event, obj) {
            console.log('uv.onShowHelpDialogue');
        });

        $(document).bind('uv.onShowInformation', function (event, obj) {
            console.log('uv.onShowInformation');
        });

        $(document).bind('uv.onShowLoginDialogue', function (event, obj) {
            console.log('uv.onShowLoginDialogue');
        });

        $(document).bind('uv.onShowOverlay', function (event, obj) {
            console.log('uv.onShowOverlay');
        });

        $(document).bind('uv.onShowSettingsDialogue', function (event, obj) {
            console.log('uv.onShowSettingsDialogue');
        });

        $(document).bind('uv.onThumbSelected', function (event, obj) {
            console.log('uv.onThumbSelected');
        });

        $(document).bind('uv.onToggleFullScreen', function (event, obj) {
            console.log('uv.onToggleFullScreen', obj.isFullScreen);
        });

        $(document).bind('uv.onUpArrow', function (event, obj) {
            console.log('uv.onUpArrow');
        });

        $(document).bind('uv.onUpdateSettings', function (event, obj) {
            console.log('uv.onUpdateSettings');
        });

        $(document).bind('uv.onViewFullTerms', function (event, obj) {
            console.log('uv.onViewFullTerms');
        });

        $(document).bind('uv.onWindowUnload', function (event, obj) {
            console.log('uv.onWindowUnload');
        });

        $(document).bind('seadragonExtension.onClearSearch', function (event, obj) {
            console.log('seadragonExtension.onClearSearch');
        });

        $(document).bind('seadragonExtension.onCurrentViewUri', function (event, obj) {
            console.log('seadragonExtension.onCurrentViewUri');
        });

        $(document).bind('seadragonExtension.onFirst', function (event, obj) {
            console.log('seadragonExtension.onFirst');
        });

        $(document).bind('seadragonExtension.onGalleryThumbSelected', function (event, obj) {
            console.log('seadragonExtension.onGalleryThumbSelected');
        });

        $(document).bind('seadragonExtension.onImageSearch', function (event, obj) {
            console.log('seadragonExtension.onImageSearch');
        });

        $(document).bind('seadragonExtension.onLast', function (event, obj) {
            console.log('seadragonExtension.onLast');
        });

        $(document).bind('seadragonExtension.onModeChanged', function (event, obj) {
            console.log('seadragonExtension.onModeChanged', obj);
        });

        $(document).bind('seadragonExtension.onNext', function (event, obj) {
            console.log('seadragonExtension.onNext');
        });

        $(document).bind('seadragonExtension.onNextSearchResult', function (event, obj) {
            console.log('seadragonExtension.onNextSearchResult');
        });

        $(document).bind('seadragonExtension.onOpenThumbsView', function (event, obj) {
            console.log('seadragonExtension.onOpenThumbsView');
        });

        $(document).bind('seadragonExtension.onOpenTreeView', function (event, obj) {
            console.log('seadragonExtension.onOpenTreeView');
        });

        $(document).bind('seadragonExtension.onPageSearch', function (event, obj) {
            console.log('seadragonExtension.onPageSearch');
        });

        $(document).bind('seadragonExtension.onPrev', function (event, obj) {
            console.log('seadragonExtension.onPrev');
        });

        $(document).bind('seadragonExtension.onPrevSearchResult', function (event, obj) {
            console.log('seadragonExtension.onPrevSearchResult');
        });

        $(document).bind('seadragonExtension.onAnimation', function (event, obj) {
            console.log('seadragonExtension.onAnimation');
        });

        $(document).bind('seadragonExtension.onAnimationfinish', function (event, obj) {
            console.log('seadragonExtension.onAnimationfinish');
        });

        $(document).bind('seadragonExtension.onAnimationStart', function (event, obj) {
            console.log('seadragonExtension.onAnimationStart');
        });

        $(document).bind('seadragonExtension.onOpen', function (event, obj) {
            console.log('seadragonExtension.onOpen');
        });

        $(document).bind('seadragonExtension.onSearchPreviewStart', function (event, obj) {
            console.log('seadragonExtension.onSearchPreviewStart');
        });

        $(document).bind('seadragonExtension.onSearchPreviewFinish', function (event, obj) {
            console.log('seadragonExtension.onSearchPreviewFinish');
        });

        $(document).bind('seadragonExtension.onRotation', function (event, obj) {
            console.log('seadragonExtension.onRotation');
        });

        $(document).bind('seadragonExtension.onSearch', function (event, obj) {
            console.log('seadragonExtension.onSearch', obj);
        });

        $(document).bind('seadragonExtension.onSearchResults', function (event, obj) {
            console.log('seadragonExtension.onSearchResults', obj);
        });

        $(document).bind('seadragonExtension.onSearchResultsEmpty', function (event, obj) {
            console.log('seadragonExtension.onSearchResultsEmpty');
        });

        $(document).bind('seadragonExtension.onTreeNodeSelected', function (event, obj) {
            console.log('seadragonExtension.onTreeNodeSelected', obj);
        });

        $(document).bind('seadragonExtension.onViewPage', function (event, obj) {
            console.log('seadragonExtension.onViewPage', obj);
        });

        $(document).bind('seadragonExtension.onCurrentViewUri', function (event, obj) {
            console.log('seadragonExtension.onCurrentViewUri', obj);
        });

        $(document).bind('mediaelementExtension.onMediaEnded', function (event, obj) {
            console.log('mediaelementExtension.onMediaEnded');
        });

        $(document).bind('mediaelementExtension.onMediaPaused', function (event, obj) {
            console.log('mediaelementExtension.onMediaPaused');
        });

        $(document).bind('mediaelementExtension.onMediaPlayed', function (event, obj) {
            console.log('mediaelementExtension.onMediaPlayed');
        });
    }

    function init() {

        $('#manifestSelect').on('change', function(){
            $('#manifest').val($('#manifestSelect option:selected').val());
            updateDragDrop();
        });

        $('#setManifestBtn').on('click', function(e){
            e.preventDefault();
            reload();
        });

        uvEventHandlers();

        if ($('#manifestSelect option').length || $('#manifestSelect optgroup').length){
            setSelectedManifest();
        }

        loadViewer();
    }

    var isLocalhost = document.location.href.indexOf('localhost') != -1;

    loadManifests(function() {
        init();
    });
});