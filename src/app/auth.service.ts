import { inject, Injectable, signal } from '@angular/core';
import { AuthResponse, createClient, OAuthResponse, UserResponse } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { Observable, from } from 'rxjs';
import type { User, FamilyMember } from './models';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  currentUser = signal<User | null>(null);
  public userId = signal<string | null>(null);
  public userEmail = signal<string | null>(null);
  public familyMembers = signal<FamilyMember[]>([]);
  public familyMemberDefault = signal(0);
  public userName = signal<string | null>(null);
  public userAvatar = signal<string | null>(null);
  

  public supabase = createClient(environment.supabaseUrl, environment.supabaseKey);




  public async getCurrentUser(): Promise<User | null> {
    if (this.currentUser() === null) {
      const response = await this.supabase.auth.getUser();


      if (response.data.user?.email) {
        this.userId.set(response.data.user.id);
        this.userEmail.set(response.data.user.email);
        this.userAvatar.set(response.data.user.user_metadata['avatar_url']);
        this.userName.set(response.data.user.user_metadata['name']);

        await this.getFamilyMembers(response.data.user.id);

        // const userData = await this.getUserInfo(this.userId()!);

        // if(userData){
        //   this.userName.set(userData.username)
        //   this.userAvatar.set(userData.avatar_url);
        // }

        const user: User = {
          username: response.data.user?.user_metadata['name'],
          email: response.data.user?.email,
          lastName: '',
          avatar: response.data.user?.user_metadata['avatar_url'],
        } 
        this.setCurrentuser(user);
      }
    }
    
    return this.currentUser();
  }

  public setCurrentuser(user: User) {
    this.currentUser.set(user)
  }


  public sigInWithEmailPassword(email: string, password: string): Observable<AuthResponse> {
    const result = this.supabase.auth.signInWithPassword({ email, password });

    return from(result);
  }

  public sigInWithGoogle(): Observable<OAuthResponse> {
    const result = this.supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    return from(result);
  }

  public async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
    this.currentUser.set(null);

    this.userEmail.set(null);
    this.userId.set(null);
    localStorage.setItem('familyId', '');
    this.router.navigate(['/login'])
  }

  public async getUserInfo(userId: string){
    const {data, error} = await this.supabase.from('user_info')
      .select('username, avatar_url')
      .eq('user_id', userId)


      if(error){
        console.log(error)
        return false;
      }
      
      return data[0];
  }

  public async updateUserInfo(userName:string){
    const {error} = await this.supabase.from('user_info')
      .update({username: userName})
      .eq('user_id', this.userId())

      if(error){
        console.log(error);
      }
  }

  public async saveUserInfo(username: string, avatarUrl: string){
    const {data, error} = await this.supabase.from('user_info').insert({username: username, avatar_url: avatarUrl})
    if(error){
      console.log(error);
      return;
    }

    this.userName.set(username);
    this.userAvatar.set(avatarUrl);

  }

  public async getFamilyMembers(userId: string){
    console.log(this.userName())
    const {data, error} = await this.supabase
      .from('family_members')
      .select('id, name, default')
      .eq('user_id',userId )

    if(error){
      console.log(error);
      return;
    }


    if(data && data.length === 0){
     await this.createFamily();
     return;
    }

    this.familyMembers.set(data);
    this.familyMemberDefault.set(data[0].id);

    console.log(this.familyMembers())
  }

  private creatingFamily = signal(false);

  public async createFamily(){
    if(this.creatingFamily()) return;
    this.creatingFamily.set(true);
    if(this.familyMembers().length > 0) return;
    const familymembers = [
      {name: this.userName(), user_id: this.userId(), default: true},
      {name: 'Família', user_id: this.userId(), default: true},
    ]
    const {data, error} = await this.supabase
    .from('family_members')
    .insert(familymembers)
    .select('id, name, default') 

    if(error){
      console.log(error);
      return;
    }

    console.log('Family created');
    this.familyMembers.set(data);
    this.familyMemberDefault.set(data[0].id);

    console.log(this.familyMemberDefault());
    console.log(this.familyMembers());

  }

  getFamilyMemberName(id: number): string {
    return this.familyMembers().find(item => item.id == id)?.name ?? '';
  }


}
