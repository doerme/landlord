{{each data as v i}}
<li>
    <img class="ul-avatar" src="{{v.avatar}}" />
    <div class="ul-name">{{v.name}}</div>
    <div class="ul-gold">{{v.score}}</div>
</li>
{{/each}}