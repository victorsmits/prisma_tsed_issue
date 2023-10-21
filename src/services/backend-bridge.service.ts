import {Injectable} from "@tsed/di";
import axios, {Axios} from 'axios';
import {envs} from '../config/envs';

@Injectable()
export class BackendBridgeService {
  
  private api: Axios;
  
  constructor() {
    this.api = axios.create({
      baseURL: envs.game.url,
    });
  }
  
}
