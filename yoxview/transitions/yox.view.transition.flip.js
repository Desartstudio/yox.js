yox.view.transitions.flip = function(){
    var $frame,
        panels,
        currentPanelIndex = 1,
        defaultTransitionTime,
        currentTransitionTime,
        currentDeg = -180,
        currentItemIndex = 0,
        self = this;

    this.create = function($container, onLoad){
        var view = this;
        self.$container = $container;
        $container.css("perspective", "800px");
        $frame = $("<div>", { "class": "yoxviewFrame yoxviewFrame_" + this.options.resizeMode + " yoxviewFrame_" + $.yoxview.platform + " yoxviewFrame_flip"}).appendTo($container);
        if (this.options.transitionTime){
            currentTransitionTime = defaultTransitionTime = this.options.transitionTime;
            $frame.css({
                transition: yox.utils.browser.getCssPrefix() + "transform " + defaultTransitionTime + "ms ease-out",
                transformStyle: "preserve-3d",
                width: $container.width() - this.options.margin.horizontal,
                left: this.options.margin.left,
                height: "100%",
                border: "none",
                overflow: "visible"
            });
        }

        panels = [];
        for(var i=0; i<2; i++){
            var $img = $("<img>", { src: "", "class": "yoxviewImg" });
            if (i === 1)
                $img.css("transform", "rotateY(180deg)");

            $img.css({
                backfaceVisibility: "hidden",
                background: "Black",
                position: "absolute",
                top: "50%", left: "50%",
                width: 0, height: 0,
                border: "solid 1px #666",
                transform: i ? "rotateY(180deg)" : "rotateY(0)", // The rotate(0) is for Firefox, which otherwise displays the backface (bug exists in version 11)
                marginLeft: "-" + this.options.margin.left + "px"
            });

            $img.attr("data-index", i);
            $img.on("load", { view: view }, onLoad);
            panels.push($img.appendTo($frame));
        }
    };

    this.destroy = function(){
        self.$container.css("perspective", "");
        $frame.remove();
    };

    this.getCurrentPanel = function(){
        return panels[currentPanelIndex];
    };

    this.getPanel = function(item){
        currentPanelIndex = currentPanelIndex ? 0 : 1;
        return panels[currentPanelIndex];
    };

    this.transition = function(options){console.log("Trans", (new Error()).stack);
        self.getCurrentPanel().css(options.position);
        if (options.isUpdate){
            $frame.css({
                width: self.$container.width() - this.options.margin.horizontal,
                left: this.options.margin.left
            });
        }
        else {
            currentDeg += options.index > currentItemIndex ? 180 : -180;
            currentItemIndex = options.index;
            $frame.css("transform", "rotateY(" + currentDeg + "deg)");
        }
    };

    this.update = function(updateData){
        if (updateData.transitionTime !== undefined)
            $frame.css("transitionDuration", updateData.transitionTime + "ms");
    };
};

yox.view.transitions.flip.prototype = new yox.view.transition();