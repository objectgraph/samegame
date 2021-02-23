<script>
    import { beforeUpdate, afterUpdate } from "svelte";
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

{Object.keys(colors)}:{Object.values(colors)}
