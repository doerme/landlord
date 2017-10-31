{{each cardarr as v i}}
    <img class="pok {{if begin}} notshow {{/if}}" src="{{carddata[v]}}" pknum="{{v}}" />
{{/each}}