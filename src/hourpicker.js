/*!
 * HourPicker
 * Copyright 2015 Rémi Koenig
 */

;(function($) {
    "use strict";

    var
        tpl = [
            '<div class="popover popover-hour-picker" role="tooltip">',
                '<div class="arrow"></div>',
                '<h3 class="popover-title"></h3>',
                '<div class="popover-content"></div>',
            '</div>'
        ].join(''),
        contentTpl = [
            '<div class="dial">',
                '<div class="num btn btn-default" data-num="0" style="top: 0.0%; left: 50.0%">0</div>',
                '<div class="num btn btn-default" data-num="1" style="top: 6.7%; left: 75.0%">1</div>',
                '<div class="num btn btn-default" data-num="2" style="top: 25.0%; left: 93.3%">2</div>',
                '<div class="num btn btn-default" data-num="3" style="top: 50.0%; left: 100.0%">3</div>',
                '<div class="num btn btn-default" data-num="4" style="top: 75.0%; left: 93.3%">4</div>',
                '<div class="num btn btn-default" data-num="5" style="top: 93.3%; left: 75.0%">5</div>',
                '<div class="num btn btn-default" data-num="6" style="top: 100.0%; left: 50.0%">6</div>',
                '<div class="num btn btn-default" data-num="7" style="top: 93.3%; left: 25.0%">7</div>',
                '<div class="num btn btn-default" data-num="8" style="top: 75.0%; left: 6.7%">8</div>',
                '<div class="num btn btn-default" data-num="9" style="top: 50.0%; left: 0.0%">9</div>',
                '<div class="num btn btn-default" data-num="10" style="top: 25.0%; left: 6.7%">10</div>',
                '<div class="num btn btn-default" data-num="11" style="top: 6.7%; left: 25.0%">11</div>',
                '<div class="dial-arrow"></div>',
            '</div>',
            '<div class="btn-group-time-picker">',
                '<button type="button" class="btn btn-default btn-block am">AM</button>',
                '<button type="button" class="btn btn-default btn-block pm">PM</button>',
                '<button type="button" class="btn btn-default btn-block anytime">Anytime</button>',
            '</div>',
        ].join('');


    function hourToString(value, am) {
        if (am) {
            return value == 0 ? 'Midnight' : value + ' AM'
        }
        return value == 0 ? 'Noon' : value + ' PM';
    }

    function stringToHour(value) {
        if (value == 'Anytime') {
            return null;
        } else if (value == 'Midnight') {
            return [0, 'AM'];
        } else if (value == 'Noon') {
            return [0, 'PM'];
        }
        var result = value.match(/(\d+) ([AP]M)/);
        return [parseInt(result[1]), result[2]];
    }

    // HOURPICKER PUBLIC CLASS DEFINITION
    // ===============================

    var HourPicker = function (element, options) {
        this.init('hourpicker', element, options);
        this.$input = this.$element.find('input').focus(function() {
            $(this).blur();
        });
        this.value = undefined;
    };

    if (!$.fn.popover) throw new Error('HourPicker requires popover.js')


    HourPicker.DEFAULTS = $.extend({}, $.fn.popover.Constructor.DEFAULTS, {
        html: true,
        template: tpl
    });


    // NOTE: HOURPICKER EXTENDS popover.js
    // ================================

    HourPicker.prototype = $.extend({}, $.fn.popover.Constructor.prototype);

    HourPicker.prototype.constructor = HourPicker;

    HourPicker.prototype.getDefaults = function () {
        return HourPicker.DEFAULTS;
    };

    HourPicker.prototype.getPosition = function ($element) {
        $element = $element || this.$element.find('span').first();
        return $.fn.tooltip.Constructor.prototype.getPosition.call(this, $element);
    };

    HourPicker.prototype.getContent = function() {
        var
            $content = $(contentTpl),
            $num = $content.find('.num'),
            $arrow = $content.find('.dial-arrow'),
            $am = $content.find('.am'),
            $pm = $content.find('.pm'),
            $amPmDefault = $am,
            $anytime = $content.find('.anytime'),
            $amPm = $am.add($pm),
            $amPmAny = $am.add($pm).add($anytime),
            hour,
            that = this,
            initial = stringToHour(this.$input.val());

        if (initial === null) {
            $anytime.addClass('btn-primary');
        } else {
            hour = initial[0];
            (initial[1] === 'AM' ? $am : $pm).addClass('btn-primary');
            $num.eq(hour).addClass('btn-primary');
            rotateArrow(hour);
        }

        $num.click(function() {
            var el = $(this);
            hour = el.data('num');
            $num.removeClass('btn-primary');
            el.addClass('btn-primary');
            $anytime.removeClass('btn-primary');
            if (!$am.hasClass('btn-primary') && !$pm.hasClass('btn-primary')) {
                $amPmDefault.addClass('btn-primary');
            }
            rotateArrow(hour);
            that.setValue(hour + ($pm.hasClass('btn-primary') ? 12 : 0));

        });
        $amPm.click(function() {
            $amPmAny.removeClass('btn-primary');
            $(this).addClass('btn-primary');
            $amPmDefault = $(this);
            if (hour !== undefined) {
                that.setValue(hour + ($pm.hasClass('btn-primary') ? 12 : 0));
                that.hide();
            }
        });
        $anytime.click(function() {
            $amPmAny.removeClass('btn-primary');
            $(this).addClass('btn-primary');
            $num.removeClass('btn-primary');
            hour = undefined;
            that.setValue(undefined);
            that.hide();
        });

        function rotateArrow(value) {
            $arrow.css('transform', 'rotate(' + value * 360 / 12 + 'deg)');
        }

        return $content;
    };

    HourPicker.prototype.setValue = function(value) {
        var formattedValue = value === undefined ? 'Anytime': hourToString(value % 12, value < 12)
        this.$input.val(formattedValue);
        this.$element.trigger('change.bs.' + this.type, [value, formattedValue]);
        this.value = value;
    }

    HourPicker.prototype.getValue = function(value) {
        return this.value;
    }

    // HOURPICKER PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var
                $this   = $(this),
                data    = $this.data('bs.hourpicker'),
                options = typeof option == 'object' && option;

            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data('bs.hourpicker', (data = new HourPicker(this, options)));
            if (typeof option == 'string') data[option]();
        })
    }

    var old = $.fn.hourpicker;

    $.fn.hourpicker             = Plugin;
    $.fn.hourpicker.Constructor = HourPicker;


    // HOURPICKER NO CONFLICT
    // ===================

    $.fn.hourpicker.noConflict = function () {
        $.fn.hourpicker = old;
        return this;
    }
})(window.jQuery);
