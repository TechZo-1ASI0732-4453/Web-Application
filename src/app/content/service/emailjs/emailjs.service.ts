import { Injectable } from '@angular/core';
import emailjs from "emailjs-com";
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailjsService {

  constructor() { 
    emailjs.init('lxgr2Cag9uXB3-qzt');
  }

   sendNotification(status: string, name: string, itemTitle: string, email: string): Observable<any> {
    const statusData = this.generateStatusData(status);

    const templateParams = {
      name: name,
      item_title: itemTitle,
      status_message: statusData.statusMessage,
      status_hint: statusData.statusHint,
      status_color: statusData.statusColor,
      email: email
    };

    return from(emailjs.send('service_n1ojeiz', 'template_ogjf4h9', templateParams));
  }

   private generateStatusData(status: string): { statusMessage: string, statusHint: string, statusColor: string } {
    switch (status.toUpperCase()) {
      case 'RECIBIDA':
        return {
          statusMessage: '¡Has recibido una nueva oferta por uno de tus productos!',
          statusHint: 'Revisa los detalles en la aplicacion y responde cuanto antes.',
          statusColor: '#28a745'
        };
      case 'ACEPTADA':
        return {
          statusMessage: '¡Tu oferta ha sido aceptada! Felicidades, ahora pueden coordinar el intercambio.',
          statusHint: 'Contacta a la otra persona desde la app para concretar el trato.',
          statusColor: '#007bff'
        };
      case 'RECHAZADA':
        return {
          statusMessage: 'Tu oferta fue rechazada. ¡No te desanimes y sigue buscando artículos interesantes!',
          statusHint: 'Puedes seguir explorando opciones dentro de CambiaZo.',
          statusColor: '#dc3545'
        };
      default:
        return {
          statusMessage: 'Hay una actualización respecto a tu oferta.',
          statusHint: 'Ingresa a la app para más detalles.',
          statusColor: '#6c757d'
        };
    }
  }
}
