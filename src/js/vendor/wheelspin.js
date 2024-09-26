import $ from "jquery";
import "./jquery-ui.min.js";

(function () {
  var pluginName = "wheelSpinAnimation",
    init_arr = [],
    defaults = {
      prizes: [],
      width: 500,
      height: 250,
      random: true,
      spinning: false,
      speed: 40,
      speedStop: 300,
      speedStopEase: 4000,
      speedSlowDown: 150,
      result: false,
      resultTurn: -1,
      resultNum: -1,
      scalePercent: 1,
      callback: "",
    };

  /*!
   *
   * INIT - This is the function that runs to init
   *
   */
  $.fn[pluginName] = function (options, value) {
    if (typeof options == "string") {
      var $this = $(this);
      var _opts = $this.data("plugin_" + pluginName);
      if (_opts !== undefined) $.fn[pluginName].commandWheelSpinAnimation(this, options, value);
    } else {
      return this.each(function () {
        var $this = $(this);
        var _opts = $this.data("plugin_" + pluginName);

        $.fn[pluginName].destroy($this);

        var _opts = $.extend({}, defaults, options);
        $this.data("plugin_" + pluginName, _opts);

        init_arr.push($this.attr("id"));
        $.fn[pluginName].initAnimation($this);
      });
    }
  };

  /*!
   *
   * START SPIN SETUP - This is the function that runs to build wheel spin
   *
   */
  $.fn[pluginName].initAnimation = function (obj) {
    return obj.each(function () {
      var _self = $(this);
      var _opts = _self.data("plugin_" + pluginName);

      $.fn[pluginName].buildPrizes(_self);
      $.fn[pluginName].resizeWheelSpin(_self);

      $.fn[pluginName].swapSlide(_self, true);
      $.fn[pluginName].swapSlide(_self, true);

      //   _self.find(".wheelSpinList ul").css("top", -(_opts.height + _opts.height / 2) * _opts.scalePercent);
      // _self.find(".wheelSpinList ul").css("top", 8);

      $(window).bind("resize", function (e) {
        $.fn[pluginName].resizeWheelSpin(_self);
      });
    });
  };

  /*!
   *
   * PRIZES - This is the function that runs to create prizes
   *
   */
  $.fn[pluginName].buildPrizes = function (obj) {
    return obj.each(function () {
      var _self = $(this);
      var _opts = _self.data("plugin_" + pluginName);

      _opts.seq = [];
      var countNum = 0;
      var maxPrizeLists = _opts.prizes.length;
      maxPrizeLists = maxPrizeLists < 5 ? 5 : maxPrizeLists;

      for (var n = 0; n < maxPrizeLists; n++) {
        _opts.seq.push(countNum);
        countNum++;
        countNum = countNum >= _opts.prizes.length ? 0 : countNum;
      }
    });
  };

  $.fn[pluginName].resizeWheelSpin = function (obj) {
    return obj.each(function () {
      var _self = $(this);
      var _opts = _self.data("plugin_" + pluginName);

      _opts.scalePercent = parseInt(_self.outerWidth()) / _opts.width;

      //   _self.find(".wheelSpinSelect").css("width", _opts.width * _opts.scalePercent);
      //   _self.find(".wheelSpinSelect").css("height", _opts.height * _opts.scalePercent);
      // _self.find('.wheelSpinSelect').css('top', (_opts.height/2) * _opts.scalePercent);
      _self.find(".wheelSpinSelect").css("top", -10);
      _self.find(".wheelSpinSelect").css("width", 186);
      _self.find(".wheelSpinSelect").css("height", 75);

      //   _self.find(".wheelSpinHighlightBackground").css("width", _opts.width * _opts.scalePercent);
      //   _self.find(".wheelSpinHighlightBackground").css("height", _opts.height * _opts.scalePercent);
      // _self.find('.wheelSpinHighlightBackground').css('top', (_opts.height/2) * _opts.scalePercent);
      _self.find(".wheelSpinHighlightBackground").css("width", 186);
      _self.find(".wheelSpinHighlightBackground").css("height", 75);

      _self.find(".wheelSpinHighlight").css("width", _opts.width * _opts.scalePercent);
      _self.find(".wheelSpinHighlight").css("height", _opts.height * _opts.scalePercent);
      // _self.find('.wheelSpinHighlight').css('top', (_opts.height/2) * _opts.scalePercent);
      _self.find(".wheelSpinHighlight").css("width", 186);
      _self.find(".wheelSpinHighlight").css("height", 75);

      //   _self.find(".wheelSpinList").css("width", _opts.width * _opts.scalePercent);
      //   _self.find(".wheelSpinList").css("height", _opts.height * 2 * _opts.scalePercent);
      _self.find(".wheelSpinList").css("width", 186);
      _self.find(".wheelSpinList").css("height", 75);

      //   _self.find(".wheelSpinBorder").css("width", _opts.width * _opts.scalePercent);
      //   _self.find(".wheelSpinBorder").css("height", _opts.height * 2 * _opts.scalePercent);
      _self.find(".wheelSpinBorder").css("width", 186);
      _self.find(".wheelSpinBorder").css("height", 75);

      _self.find(".wheelSpinList .prizeList").each(function (index, element) {
        $(this).css("width", _opts.width * _opts.scalePercent);
        $(this).css("height", _opts.height * _opts.scalePercent);
      });
    });
  };

  $.fn[pluginName].swapSlide = function (obj, con) {
    return obj.each(function () {
      var _self = $(this);
      var _opts = _self.data("plugin_" + pluginName);

      if (con) {
        _self.find(".wheelSpinList li.prizeList:eq(0)").before(_self.find(".wheelSpinList li.prizeList:eq(" + (_opts.seq.length - 1) + ")"));
      } else {
        _self.find(".wheelSpinList li.prizeList:eq(" + (_opts.seq.length - 1) + ")").after(_self.find(".wheelSpinList li.prizeList:eq(0)"));
      }
    });
  };

  $.fn[pluginName].spinAnimation = function (obj, con) {
    return obj.each(function () {
      var _self = $(this);
      var _opts = _self.data("plugin_" + pluginName);

      var newPosition, queaterPosition, easing, duration;

      if (con === "start") {
        // _self.find('.wheelSpinList ul').css('top', -((_opts.height) + (_opts.height / 2)) * _opts.scalePercent);
        _self.find(".wheelSpinList ul").css("top", 0);

        newPosition = -(_opts.height + _opts.height / 2) * _opts.scalePercent;
        queaterPosition = (_opts.height / 3) * _opts.scalePercent;
        easing = "easeOutBack";

        _self
          .find(".wheelSpinList li")
          .eq(2)
          .css("background-image", "url(" + _self.find(".wheelSpinList li").eq(2).attr("data-bg") + ")");

        _self
          .find(".wheelSpinList ul")
          .stop()
          .animate({ top: newPosition - queaterPosition }, _opts.speed, easing, function () {
            $.fn[pluginName].spinAnimation(_self, "loop");
          });
      } else if (con === "loop") {
        newPosition = -(_opts.height + _opts.height / 2) * _opts.scalePercent;
        easing = "linear";
        duration = _opts.speed;

        if (!_opts.spinning) {
          if (_opts.result && _opts.resultTurn === -1) {
            var turn = (_opts.speedStop - _opts.speed) / 100;
            if (String(turn).indexOf(".") > -1) {
              turn = Math.floor(turn) + 1;
            }
            _opts.resultTurn = turn;
          }
          _opts.speedCount += _opts.speedSlowDown;
          _opts.speedCount = _opts.speedCount > _opts.speedStop ? _opts.speedStop : _opts.speedCount;
          duration = _opts.speedCount;
        }

        _self
          .find(".wheelSpinList ul")
          .stop()
          .animate({ top: newPosition }, duration, easing, function () {
            $.fn[pluginName].swapSlide(_self, true);
            _self.find('.wheelSpinList ul').css('top', -((_opts.height * 2) + (_opts.height / 2)) * _opts.scalePercent);
            // _self.find(".wheelSpinList ul").css("top", 0);

            var loopCon = true;
            if (!_opts.spinning) {
              if (_opts.speedCount >= _opts.speedStop) {
                loopCon = false;

                if (_opts.result) {
                  var prevIndex = Number(_self.find(".wheelSpinList li").eq(2).attr("data-prizenum"));
                  if (prevIndex !== _opts.resultNum) {
                    loopCon = true;
                  }
                }
              }
            }

            if (loopCon) {
              $.fn[pluginName].spinAnimation(_self, "loop");
            } else {
              $.fn[pluginName].spinAnimation(_self, "stop");
            }
          });
      } else if (con === "stop") {
        // _self.find('.wheelSpinList ul').css('top', 2*-((_opts.height * 2) + (_opts.height / 2)) * _opts.scalePercent);
        // _self.find(".wheelSpinList ul").css("top", 0);

        newPosition = -(_opts.height + _opts.height / 2) * _opts.scalePercent;
        easing = "easeOutBack";

        _self
          .find(".wheelSpinList ul")
          .stop()
          .animate({ top: 0 }, _opts.speedStopEase, easing, function () {
            $.fn[pluginName].spinHighlightAnimation(_self, true);
            $.fn[pluginName].callbackWheelSpin(_self, "spinstop");

            if (_self.find(".wheelSpinList li").attr("data-winbg") !== undefined) {
              _self
                .find(".wheelSpinList li")
                // .eq(2)
                .css("background-image", "url(" + _self.find(".wheelSpinList li").attr("data-winbg") + ")");
            }
          });
      }
    });
  };

  $.fn[pluginName].spinHighlightAnimation = function (obj, con) {
    return obj.each(function () {
      var _self = $(this);
      var _opts = _self.data("plugin_" + pluginName);

      if (con) {
        _self.find(".wheelSpinHighlight").addClass("flashing");
      } else {
        _self.find(".wheelSpinHighlight").removeClass("flashing");
      }
    });
  };

  $.fn[pluginName].toggleSpin = function (obj, con) {
    return obj.each(function () {
      var _self = $(this);
      var _opts = _self.data("plugin_" + pluginName);

      _opts.result = false;
      _opts.resultNum = -1;
      _opts.resultTurn = -1;

      $.fn[pluginName].spinHighlightAnimation(_self, false);

      if (con !== undefined) {
        _opts.spinning = con;
        if (_opts.spinning) {
          $.fn[pluginName].spinAnimation(_self, "start");
          $.fn[pluginName].callbackWheelSpin(_self, "spinstart");
        } else {
          _opts.speedCount = _opts.speed;
        }
      } else {
        if (_opts.spinning) {
          _opts.speedCount = _opts.speed;
          _opts.spinning = false;
        } else {
          _opts.spinning = true;
          $.fn[pluginName].spinAnimation(_self, "start");
          $.fn[pluginName].callbackWheelSpin(_self, "spinstart");
        }
      }
    });
  };

  $.fn[pluginName].callbackWheelSpin = function (obj, command, con) {
    return obj.each(function () {
      var _self = $(this);
      var _opts = _self.data("plugin_" + pluginName);
      con = con === undefined ? true : con;
      if ($.isFunction(_opts.callback) && con) {
        var returnData = _opts;
        returnData.status = command;
        returnData.id = _self.attr("id");
        _opts.callback(returnData);
      }
    });
  };

  /*!
   *
   * UPDATE WHEEL SPIN SETTINGS - This is the function that runs to update wheel spin settings
   *
   */
  $.fn[pluginName].commandWheelSpinAnimation = function (obj, command, value) {
    return obj.each(function () {
      var _self = $(this);
      var _opts = _self.data("plugin_" + pluginName);

      if (init_arr.indexOf(_self.attr("id")) !== -1) {
        switch (command) {
          case "destroy":
            $.fn[pluginName].destroy(_self);
            break;
          case "toggleSpin":
            $.fn[pluginName].toggleSpin(_self);
            break;
          case "spin":
            $.fn[pluginName].toggleSpin(_self, true);
            break;
          case "stop":
            $.fn[pluginName].toggleSpin(_self, false);
            break;
          case "result":
            if (_opts.spinning) {
              $.fn[pluginName].toggleSpin(_self, false);
              _opts.result = true;
              _opts.resultTurn = -1;
              _opts.resultNum = value;
            }
            break;
          default:
            if (_opts[value] !== undefined) {
              //_opts[value]=value2;
            }
        }
      }
    });
  };

  /*!
   *
   * DESTROY WHEEL SPIN ANIMATION - This is the function that runs to destroy wheel spin animation
   *
   */
  $.fn[pluginName].destroy = function (obj) {
    
    return obj.each(function () {
      var _self = $(this);
      var _opts = _self.data("plugin_" + pluginName);

      if (_opts === undefined) return; 
      
      if (init_arr.indexOf(_self.attr("id")) !== -1) {
        _opts.spinning = false;
        _self.find(".wheelSpinList ul").stop();
        _self.find(".wheelSpinList").empty();
        $.fn[pluginName].spinHighlightAnimation(_self, false);

        var indexNum = init_arr.indexOf(_self.attr("id"));
        init_arr.splice(indexNum, 1);
        _opts = undefined;
      }
    });
  };

  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
})();
