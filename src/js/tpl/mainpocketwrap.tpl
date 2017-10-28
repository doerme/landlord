<div class="main-pocket-wrap-top">
{{each cardarr as v i}}
    {{if i < 10}}
    <img class="pok" src="{{carddata[v * 1]}}" pknum="{{v * 1}}" />
    {{/if}}
{{/each}}
</div>
<div class="main-pocket-wrap-bottom">
{{each cardarr as v i}}
    {{if i >= 10}}
    <img class="pok" src="{{carddata[v * 1]}}" pknum="{{v * 1}}" />
    {{/if}}
{{/each}}
</div>