<script>
    import { beforeUpdate, afterUpdate } from "svelte";
    import {getColor} from './Common.svelte';
    export let data;

    let colors = {};
    beforeUpdate(() => {
        colors = {};
        data.forEach((row) => {
            row.forEach((cell) => {
                if (!cell.deleted) {
                    if (!Object.keys(colors).includes("" + cell.color + "")) {
                        colors[cell.color] = 1;
                    } else {
                        colors[cell.color] = colors[cell.color] + 1;
                    }
                }
            });
        });
    });
</script>
<style>
    svg{
        border:1px solid #ccc
    }
</style>
<svg width={Object.keys(colors).length*80} height={60}>
    {#each Object.keys(colors) as col,i}
        <g transform="translate({45*i+40},{20})">
        <circle cx={10} cy={10} r={20} fill={getColor(col)}></circle>
        <text y="10" textAnchor="middle" stroke="#ffffff" strokeWidth="1px" fill="#000000" dy=".3em">{colors[col]}</text>
        </g>
    {/each}
</svg>