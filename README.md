# hourpicker

Simple hour picker for Bootstrap

Demo: https://remiremi.github.io/hourpicker

# Basic Usage

```html
<script>
    $(function () {
        var hourPicker = $('.time-select-group').hourpicker({
                container: 'body'
            });
    })
</script>
<div class="input-group time-select-group" id="time-popover" data-toggle="popover" data-placement="bottom" title="Select your preferred time">
  <input type="text" class="form-control time-input" placeholder="Time" value="Midnight" aria-describedby="time-popover">
  <span class="input-group-addon time-select-btn">
      <span class="glyphicon glyphicon-time"></span>
  </span>
</div>
```

# Options, events

HourPicker inherits from bootstrap's popover. It adds the change event:

```javascript
hourPicker.on('change.bs.hourpicker', function(e, value) {
    // do something with value
});
```

For more customizations you will probably need to look at the code (it's just 200 lines of Javascript).