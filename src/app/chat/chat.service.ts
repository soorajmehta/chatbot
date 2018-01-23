import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiAiClient } from 'api-ai-javascript';

import { environment } from '../../environments/environment';


export class Message{
  constructor(public content: string, public sentBy: string) { }
}

@Injectable()
export class ChatService {

  readonly token = environment.dialogFlow.angularBot;
  readonly client = new ApiAiClient({accessToken: this.token});

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }

  update(msg: Message){
    this.conversation.next([msg]);
  }

  converse(msg: string){
    const userMessage = new Message(msg,'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
            .then(res => {
              const speech = res.result.fulfillment.speech;
              const botMessage = new Message(speech,'bot');
              this.update(botMessage);
            });
  }



}
