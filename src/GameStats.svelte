<script>
    import { getColor } from './Common.svelte';
    export let data;

    $: colors = calculateColors(data);

    function calculateColors(data) {
        let colorCounts = {};
        data.forEach((row) => {
            row.forEach((cell) => {
                if (!cell.deleted) {
                    const colorKey = cell.color.toString();
                    colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
                }
            });
        });
        return colorCounts;
    }
</script>

<style>
    svg {
        border: 1px solid #ccc;
    }
</style>

<svg width={Object.keys(colors).length * 80} height={60}>
    {#each Object.entries(colors) as [color, count], i}
        <g transform="translate({45 * i + 40}, 30)">
            <circle cx={0} cy={0} r={20} fill={getColor(parseInt(color))}></circle>
            <text x={0} y={0} text-anchor="middle" stroke="#ffffff" stroke-width="1px" fill="#000000" dy=".3em">{count}</text>
        </g>
    {/each}
</svg>