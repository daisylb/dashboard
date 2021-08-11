<script lang="typescript">
import poll, {LOADING} from './poll'
import config from './config'

if (!config.success) throw new Error('config failed')
const appConfig = config.value.tramBoard
const timetable = poll(async signal =>{
    //await fetch(`http://tramtracker.com.au/Controllers/GetNextPredictionsForStop.ashx?stopNo=${appConfig.stopId}&routeNo=0&isLowFloor=false`)
    return ''
}, 60_000)
</script>
{$timetable !== LOADING ? $timetable : 'loading'}