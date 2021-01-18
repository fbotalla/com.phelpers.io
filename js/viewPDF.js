function pdfViewerHtml() {
    return `
        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="row">
                <div class="col-sm-4">
                    <span>Page count: <span class="pageCount"></span></span>
                </div>
                <div class="col-sm-offset-1 col-sm-3">
                    <div class="input-group input-group-md">
                        <span class="input-group-btn">
                            <button class="zoomOut btn btn-default"><span class="glyphicon glyphicon-zoom-out"></span></button>
                        </span>
                        <input type="text" class="currentZoom form-control" value="1.4" size="3"/>
                        <span class="input-group-btn">
                            <button class="zoomIn btn btn-default"><span class="glyphicon glyphicon-zoom-in"></span></button>
                        </span>
                    </div>
                </div>
                <div class="col-sm-offset-1 col-sm-3 text-right">
                    <div class="btn-group btn-group-sm">
                        <a href="#" class="btn btn-default print" title="Print PDF"
                           data-toggle="popover" crossorigin="anonymous"><i class="fas fa-print"></i> Print PDF</a>
                        <a href="#" target="_blank" class="btn btn-default download" title="Download / Save PDF"
                           data-toggle="popover"><i class="fas fa-external-link-alt"></i> Open PDF</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-body">
            <div class="pdf-wrapper"></div>
        </div>
        <div class="panel-footer">
            <div class="row">
                <div class="col-sm-4">
                    <span>Pages count: <span class="pageCount"></span></span>
                </div>
                <div class="col-sm-offset-1 col-sm-3">
                    <div class="input-group input-group-md">
                        <span class="input-group-btn">
                            <button class="zoomOut btn btn-default"><span class="glyphicon glyphicon-zoom-out"></span></button>
                        </span>
                        <input type="text" class="currentZoom form-control" value="1.4" size="3"/>
                        <span class="input-group-btn">
                            <button class="zoomIn btn btn-default"><span class="glyphicon glyphicon-zoom-in"></span></button>
                        </span>
                    </div>
                </div>
                <div class="col-sm-offset-1 col-sm-3 text-right">
                    <div class="btn-group btn-group-sm">
                        <a href="#" class="btn btn-default print" title="Print PDF"
                           data-toggle="popover" crossorigin="anonymous"><i class="fas fa-print"></i> Print PDF</a>
                        <a href="#" target="_blank" class="btn btn-default download" title="Download / Save PDF"
                           data-toggle="popover"><i class="fas fa-external-link-alt"></i> Open PDF</a>
                    </div>
                </div>
            </div>
        </div>
        <iframe id="printWindow" name="printWindow" style="display: none"></iframe>
    `
}

/**
 * Returns the filename or guessed filename from the url (see issue 3455).
 * url {String} The original PDF location.
 * @return {String} Guessed PDF file name.
 */
function getPDFFileNameFromURL(url) {
    var reURI = /^(?:([^:]+:)?\/\/[^\/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/;
    //            SCHEME      HOST         1.PATH  2.QUERY   3.REF
    // Pattern to get last matching NAME.pdf
    var reFilename = /[^\/?#=]+\.pdf\b(?!.*\.pdf\b)/i;
    var splitURI = reURI.exec(url);
    var suggestedFilename = reFilename.exec(splitURI[1]) ||
        reFilename.exec(splitURI[2]) ||
        reFilename.exec(splitURI[3]);
    if (suggestedFilename) {
        suggestedFilename = suggestedFilename[0];
        if (suggestedFilename.indexOf('%') !== -1) {
            // URL-encoded %2Fpath%2Fto%2Ffile.pdf should be file.pdf
            try {
                suggestedFilename =
                    reFilename.exec(decodeURIComponent(suggestedFilename))[0];
            } catch (e) { // Possible (extremely rare) errors:
                // URIError "Malformed URI", e.g. for "%AA.pdf"
                // TypeError "null has no properties", e.g. for "%2F.pdf"
            }
        }
    }
    return suggestedFilename || 'document.pdf';
}

/**
 * A simple bootbox to view a pdf document
 * @param pdfUrl
 */
function viewPdfBootbox(pdfUrl) {
    var $pdfViewer = $(pdfViewerHtml());
    bootbox.dialog({
        title: "PDF Viewer",
        message: $pdfViewer.find(".currentZoom").val("1.4").end(),
        onEscape: function () {

        }
    }).addClass('xlarge-bootbox-window');
    initPDFViewer(pdfUrl, $(".bootbox-body").attr("id", "pdfViewer"));
}

function viewS3PersistedFileBootbox(s3PersistedFile) {
    bootbox.dialog({
        title: "File Detail: " + s3PersistedFile.fileName,
        message: `<div id="s3PersistedFileDetail"></div>`,
        size: 'large'
    });
    let $s3PersistedFileContainer = $("#s3PersistedFileDetail");
    if (s3PersistedFile.filePreviewType === "IMAGE") {
        $s3PersistedFileContainer.append(`
            <div class="text-center" style="width: 100%">
                <a href="${s3PersistedFile.s3FileStreamPath}" target="_blank">
                    <img src="${s3PersistedFile.s3FileStreamPath}" style="max-width: 100%">
                </a>
            </div>`);
    }
    if (s3PersistedFile.filePreviewType === "PDF") {
        let $pdfViewer = $(pdfViewerHtml());
        $s3PersistedFileContainer.append($pdfViewer);
        initPDFViewer(s3PersistedFile.s3FileStreamPath, $(".bootbox-body").attr("id", "pdfViewer"));
    }
}

function initPDFViewer(url_, selector) {
    var url = url_,
        $selector = $(selector),
        $currentZoom = $selector.find(".currentZoom"),
        pdfDoc = null,
        pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = $currentZoom.val(),
        SCALE_STEP_AND_MINIMUM = 0.2;

    /**
     * Get page info from document, resize canvas accordingly, and render page.
     * @param num Page number.
     */
    function renderPage(num) {
        pageRendering = true;
        // Using promise to fetch the page
        pdfDoc.getPage(num).then(function (page) {
            var viewport = page.getViewport(scale);
            var canvas = document.createElement( "canvas" );
            canvas.style.display = "block";
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            var context = canvas.getContext('2d');

            var renderTask = page.render({canvasContext: context, viewport: viewport});

            $selector.find(".pdf-wrapper").append(canvas);

            // Wait for rendering to finish
            renderTask.promise.then(function () {
                pageRendering = false;
                if (pageNumPending !== null) {
                    // New page rendering is pending
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });
    }

    /**
     * If another page rendering in progress, waits until the rendering is
     * finished. Otherwise, executes rendering immediately.
     */
    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }

    /**
     * Renders all the pages of the PDF one after the other.
     * Does not use queueRenderPage
     */
    function renderAll() {
        // Clear the previous scaled render
        $selector.find(".pdf-wrapper").empty();
        for (var i = 0; i < pdfDoc.numPages; i++) {
            if (i >= pdfDoc.numPages) {
                return;
            }
            // Pages are 1 based
            renderPage(i+1);
        }
    }

    /**
     *
     * @param blobUrl
     */
    function downloadPdf(blobUrl) {
        var a = document.createElement('a'),
            filename = getPDFFileNameFromURL(blobUrl);

        if (a.click) {
            // Use a.click() if available. Otherwise, Chrome might show
            // "Unsafe JavaScript attempt to initiate a navigation change
            //  for frame with URL" and not open the PDF at all.
            // Supported by (not mentioned = untested):
            // - Firefox 6 - 19 (4- does not support a.click, 5 ignores a.click)
            // - Chrome 19 - 26 (18- does not support a.click)
            // - Opera 9 - 12.15
            // - Internet Explorer 6 - 10
            // - Safari 6 (5.1- does not support a.click)
            a.href = blobUrl;
            a.target = '_parent';
            // Use a.download if available. This increases the likelihood that
            // the file is downloaded instead of opened by another PDF plugin.
            if ('download' in a) {
                a.download = filename;
            }
            // <a> must be in the document for IE and recent Firefox versions.
            // (otherwise .click() is ignored)
            (document.body || document.documentElement).appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        } else {
            if (window.top === window &&
                blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
                // If _parent == self, then opening an identical URL with different
                // location hash will only cause a navigation, not a download.
                var padCharacter = blobUrl.indexOf('?') === -1 ? '?' : '&';
                blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
            }
            window.open(blobUrl, '_parent');
        }
    }

    /*************************************
     * Event bindings for the PDF Viewer controls
     */
    $selector.on("click", '.prev', function () {
        if (pageNum <= 1) {
            return;
        }
        pageNum--;
        queueRenderPage(pageNum);
    });

    $selector.on("click", '.next', function () {
        if (pageNum >= pdfDoc.numPages) {
            return;
        }
        pageNum++;
        queueRenderPage(pageNum);
    });

    /**
     * @Deprecated This isn't working
     */
    $selector.on("click", ".print", function (e) {
        e.preventDefault();

        selectPrinter("printFromPdfViewer", $("#pdfViewer .download:visible").attr('href'));

        /*
        // Print using pdf.js api
        // This code currently doesn't support automatic page orientation
        var PRINT_SCALE;
        var imageCounter = 0;
        var windowContent = '<!DOCTYPE html>';
        windowContent += '<html>';
        windowContent += '<head><title>Print canvas</title>';
        windowContent += '<style>\n' +
            '@page { size: auto;  margin: 0mm; }\n' +
            '</style>';
        windowContent += '</head><body><div id="printWindowPages">';
        windowContent += '</div></body>';
        windowContent += '</html>';
        var printWin = window.open(url, 'printWindow', 'width=' + screen.availWidth + ',height=' + screen.availHeight);
        printWin.document.open();
        printWin.document.write(windowContent);
        function imagesLoadedCallback() {
            imageCounter++;
            console.log(imageCounter);
            if (imageCounter === $(".pdf-wrapper canvas:visible").length) {
                printWin.focus();
                printWin.print();
                printWin.document.close();
                printWin.close();
            }
        }
        $.each($(".pdf-wrapper canvas:visible"), function(i, originalCanvas) {
            PDFPageView_beforePrint($("#printWindow").contents().find("#printWindowPages")[0], i);
        });
        function PDFPageView_beforePrint(printContainer, num) {
            pdfDoc.getPage(num+1).then(function (pdfPage) {
                //var CustomStyle = pdfjsLib.CustomStyle;
                var viewport = pdfPage.getViewport(1);
                // Use the same hack we use for high dpi displays for printing to get
                // better output until bug 811002 is fixed in FF.
                var PRINT_OUTPUT_SCALE = 2;
                var canvas = document.createElement('canvas');
                // The logical size of the canvas.
                canvas.width = Math.floor(viewport.width) * PRINT_OUTPUT_SCALE;
                canvas.height = Math.floor(viewport.height) * PRINT_OUTPUT_SCALE;
                // The rendered size of the canvas, relative to the size of canvasWrapper.
                canvas.style.width = (PRINT_OUTPUT_SCALE * 100) + '%';
                var cssScale = 'scale(' + (1 / PRINT_OUTPUT_SCALE) + ', ' +
                    (1 / PRINT_OUTPUT_SCALE) + ')';
                canvas.style['transform'] = cssScale;
                canvas.style['transformOrigin'] = '0% 0%';
                //CustomStyle.setProp('transform' , canvas, cssScale);
                //CustomStyle.setProp('transformOrigin' , canvas, '0% 0%');
                var canvasWrapper = document.createElement('div');
                //canvasWrapper.style['height'] = Math.floor(viewport.height) + "px";
                //canvasWrapper.style['width'] = Math.floor(viewport.width) + "px";
                canvasWrapper.appendChild(canvas);
                printContainer.appendChild(canvasWrapper);
                var ctx = canvas.getContext("2d");
                ctx.save();
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                var img = new Image;
                img.src = canvas.toDataURL("image/png", 1.0);
                ctx.drawImage(img, 0,0);
                ctx.scale(PRINT_OUTPUT_SCALE, PRINT_OUTPUT_SCALE);
                var renderContext = {
                    canvasContext: ctx,
                    viewport: viewport,
                    intent: 'print'
                };
                pdfPage.render(renderContext).promise.then(function() {
                    // Tell the printEngine that rendering this canvas/page has finished.
                    //canvas.done();
                    imagesLoadedCallback()
                }, function(error) {
                    console.error(error);
                    // Tell the printEngine that rendering this canvas/page has failed.
                    // This will make the print process stop.
                    if ('abort' in canvas) {
                        canvas.abort();
                    } else {
                        //canvas.done();
                    }
                });
            });
        }
        function printCanvas() {
            $("#printWindow").empty();
            var imageCounter = 0;
            function imagesLoadedCallback() {
                imageCounter++;
                if (imageCounter === $(".pdf-wrapper canvas:visible").length) {
                    windowContent += '</div></body>';
                    windowContent += '</html>';
                    var printWin = window.open(url, 'printWindow', 'width=' + screen.availWidth + ',height=' + screen.availHeight);
                    printWin.document.open();
                    printWin.document.write(windowContent);
                    printWin.focus();
                    printWin.print();
                    printWin.document.close();
                    printWin.close();
                }
            }
            var windowContent = '<!DOCTYPE html>';
            windowContent += '<html>';
            windowContent += '<head><title>Print canvas</title>';
            windowContent += '<style>\n' +
                '@page { size: auto;  margin: 0mm; orientation: portrait; size: A4;}\n' +
                '</style>';
            windowContent += '</head><body><div id="printWindowPages">';
            $.each($(".pdf-wrapper canvas:visible"), function (i, page) {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext("2d"),
                    img = new Image(),
                    w = page.width,
                    h = page.height;
                img.src = page.toDataURL("image/png", 1.0);
                img.onload = function () {
                    if (w > h) {
                        canvas.width = h;
                        canvas.height = w;
                        // translate to center-canvas
                        // the origin [0,0] is now center-canvas
                        ctx.translate(canvas.width / 2, canvas.height / 2);
                        // roate the canvas by +90% (==Math.PI/2)
                        ctx.rotate(Math.PI / 2);
                        // draw the signature
                        // since images draw from top-left offset the draw by 1/2 width & height
                        ctx.drawImage(img, -img.width / 2, -img.height / 2);
                        // un-rotate the canvas by -90% (== -Math.PI/2)
                        ctx.rotate(-Math.PI / 2);
                        // un-translate the canvas back to origin==top-left canvas
                        ctx.translate(-canvas.width / 2, -canvas.height / 2);
                    } else {
                        canvas.width = w;
                        canvas.height = h;
                        ctx.drawImage(img, 0, 0);
                    }
                    windowContent += '<img src="' + canvas.toDataURL("image/png", 1.0) + '">';
                    imagesLoadedCallback();
                };
            });
        }
        printCanvas();
        */


    });

    $selector.on("click", '.zoomIn', function () {
        if(pageRendering) {
            return;
        }
        if (scale > 5) {
            return;
        }
        scale = parseFloat(scale) + SCALE_STEP_AND_MINIMUM;
        $currentZoom.val(scale);
        renderAll();
    });

    $selector.on("click", '.zoomOut', function () {
        if(pageRendering) {
            return;
        }
        if (scale <= SCALE_STEP_AND_MINIMUM) {
            return;
        }
        scale -= SCALE_STEP_AND_MINIMUM;
        $currentZoom.val(scale);
        renderAll();
    });

    $currentZoom.on("change submit", function (e) {
        if (intVal($(this).val()) <= SCALE_STEP_AND_MINIMUM) { // reset the val to minimum if it's invalid.
            $(this).val(SCALE_STEP_AND_MINIMUM);
        }
        scale = $(this).val();
        renderAll();
    });

    let clickToScroll = false, clickY, clickX;
    $(".pdf-wrapper").on('mousedown', function(obj) {
        $(".pdf-wrapper").css('cursor', 'grabbing');
        clickToScroll = true;
        clickY = obj.pageY +  $('#pdfViewer .panel-body').scrollTop();
        clickX = obj.pageX +  $('#pdfViewer .panel-body').scrollLeft();

        $(".pdf-wrapper").on('mousemove', function (obj) {
            if (clickToScroll) {
                $(".pdf-wrapper").css('cursor', 'grabbing');
                $('#pdfViewer .panel-body').scrollTop(clickY - obj.pageY);
                $('#pdfViewer .panel-body').scrollLeft(clickX - obj.pageX);
                obj.preventDefault();
            }
        }),

            $(".pdf-wrapper").on('mouseup mouseleave mouseenter mouseup', function (obj) {
                clickToScroll = false;
                $(".pdf-wrapper").css('cursor', 'grab');
                obj.preventDefault();

            })
    });

    /**
     * Asynchronously downloads PDF.
     */
    PDFJS.getDocument(url).then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        $selector.find('.pageCount').text(pdfDoc.numPages);

        // Rendering all pages
        renderAll();
    });
    // set the "Open PDF" link
    $selector.find(".download").attr('href', url);
}
