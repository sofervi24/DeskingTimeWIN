const { ipcRenderer, contextBridge } = require('electron')
const moment = require('moment')
//TODO: I18N moment config
moment.updateLocale('es', {
    months : ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Deciembre"],
    monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul","Ago", "Sep", "Oct", "Nov", "Dic"],
    weekdays: ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"],
    weekdaysShort : ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    relativeTime: {
        future: "en %s",
        past:   "hace %s",
        s  : 'un momento',
        ss : '%d segundos',
        m:  "un minuto",
        mm: "%d minutos",
        h:  "una hora",
        hh: "%d horas",
        d:  "un dia",
        dd: "%d dias",
        w:  "una semana",
        ww: "%d semanas",
        M:  "un mes",
        MM: "%d meses",
        y:  "un año",
        yy: "%d años"	    	
    }
})
contextBridge.exposeInMainWorld(
    "api", {
        emit: (channel, data) => {
            ipcRenderer.send(channel, data);
        },
        listen: (channel, func) => {
            ipcRenderer.on(channel, (event, data) => func(data));
        },
        formatter: (duration) => {
            return moment.duration(duration,'seconds').locale('es').humanize(true)
        }
    },
);