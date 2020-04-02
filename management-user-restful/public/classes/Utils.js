class Utils {

    // Usaremos um método static (estático)
    // Para métodos estático não é necessário o "this",
    // Pois não iremos instanciá-los.

    static dateFormat(date){
        return date.getHours()+':'+
               date.getMinutes()+' '+
               date.getDate()+'/'+
               (date.getMonth()+1)+'/'+
               date.getFullYear();
    }
}