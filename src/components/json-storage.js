import { reactive } from "vue";
import raidSeed from "@/json-files/raid_seed.json";
import raidSeedOld from "@/json-files/raid_seed_old.json";

export const jsonFileNew = reactive({
    json: raidSeed
})
export const jsonFileOld = reactive({
    jsonOld: raidSeedOld
})