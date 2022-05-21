function loadGalleryFromJSON(url) {
    return function(onLoadHandler) {
        var artem_xmlhttp = new XMLHttpRequest();
    
        artem_xmlhttp.onload = function () {
            var artem_galleryData = [];
            
            try {
                artem_galleryData = JSON.parse(this.responseText);
            } catch (err) { }
    
            typeof onLoadHandler === "function" && onLoadHandler(artem_galleryData);
        };
    
        artem_xmlhttp.open("GET", url, true);
        artem_xmlhttp.send();
    };
}

function buildControls(sliderSelector, options) {
    var artem_controlsContainer = $("<div/>", { class: "slider-controls-container" });

    var artem_prevBtn = $("<a/>", { class: "control prev" }).html("&#10094;").on("click", function() {
        typeof options.onPrevBtnHandler === "function" && options.onPrevBtnHandler();
    });

    var artem_nextBtn = $("<a/>", { class: "control next" }).html("&#10095;").on("click", function() {
        typeof options.onNextBtnHandler === "function" && options.onNextBtnHandler();
    });

    artem_controlsContainer.append([artem_prevBtn, artem_nextBtn]);

    var isShowUpdateBtn = options.isShowUpdateBtn === undefined || options.isShowUpdateBtn;

    if (isShowUpdateBtn) {
        var artem_updateBtn = $("<button/>", { type: "button", class: "control update" }).text("Update gallery").on("click", function() {
            typeof options.onUpdateBtnHandler === "function" && options.onUpdateBtnHandler();
        })
        artem_controlsContainer.append(artem_updateBtn);
    }

    $(sliderSelector).append(artem_controlsContainer);
}

function buildSlides(sliderSelector, picturesList) {
    var artem_sliderContainer = $("<ul/>", { class: "slider-container" });

    $.each(picturesList, function() {
        var artem_image = $("<img/>", { src: this.path, alt: "picture" });
        var artem_slide = $("<li/>", { class: "slide", width: $(sliderSelector).width() }).append(artem_image);

        artem_sliderContainer.append(artem_slide);
    });

    $(sliderSelector).append(artem_sliderContainer);
}

function getShowSlideFunction(sliderSelector) {
    return function(artem_slideIndex) {
        var artem_sliderContainer = $(sliderSelector).children(".slider-container");
        var calculatedSlidesMargin = artem_slideIndex * $(sliderSelector).width();

        artem_sliderContainer.css("margin-left", -calculatedSlidesMargin + "px");
    };
}

function Slider(options) {
    var artem_slideIndex = 0;

    var showSlide = getShowSlideFunction(options.selector);

    function getSlideIndex(newIndex, slidesCount) {
        var slidesCount = $(options.selector).children(".slider-container").children().length;
        return ((slidesCount + newIndex) % slidesCount);
    }

    function nextSlide() {
        showSlide(artem_slideIndex = getSlideIndex(artem_slideIndex + 1));
    }
    
    function prevSlide() {
        showSlide(artem_slideIndex = getSlideIndex(artem_slideIndex - 1));
    }

    function loadAndShowGallery() {
        artem_slideIndex = 0;

        if (typeof options.dataSource === "function") {
            options.dataSource(function (artem_galleryData) {
                buildSlides(options.selector, artem_galleryData);
                showSlide(artem_slideIndex);
            });
        } else if (Array.isArray(options.dataSource)) {
            buildAndShowSlides(options.dataSource);
        } else {
            buildAndShowSlides([]);
        }
    }

    $(options.selector)
        .width((options.width || 800) + "px")
        .height((options.height || 600) + "px");

    buildControls(options.selector, {
        isShowUpdateBtn: options.isShowUpdateBtn,
        onPrevBtnHandler: prevSlide,
        onNextBtnHandler: nextSlide,
        onUpdateBtnHandler: loadAndShowGallery,
    });

    loadAndShowGallery();
}
