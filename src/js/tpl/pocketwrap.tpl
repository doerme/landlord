{{each cardarr as v i}}
    <img 
    {{if fromuser}}
        {{if fromuser == 'mine'}}
    class="pt-page-moveFromBottomFade pok"
        {{else if fromuser == 'left'}}
    class="pt-page-moveFromLeftFade pok"
        {{else if fromuser == 'right'}}
    class="pt-page-moveFromRightFade pok"
        {{/if}}
    {{else}}
    class="pok"
    {{/if}}
    src="{{carddata[v]}}"  pknum="{{v}}" 
    />
{{/each}}