<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;


class UserController extends Controller
{

    public function authenticate(Request $request)
    {
        $credentials = $request->only('username', 'password');
        // return JWTAuth::attempt($credentials);
        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['message' => 'The username or password is incorrect.'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['message' => 'could not create token'], 500);
        }
        $message = "Login successful";
        $expires_at = 4000;
        $user = JWTAuth::user();
        // return $user = User::where('username')->first();
        // array_push(compact('token'),"expires_at");
        return response()->json(compact('message','user','expires_at','token'));
    }
    public function authenticateDelete(Request $request)
    {
        $token = $request->bearerToken();
        JWTAuth::setToken($token)->invalidate();
        $message = "Logout successful";
        return response()->json(compact('message'));
    }

    public function register(Request $request)
    {
            $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if($validator->fails()){
                return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user','token'),201);
    }

    public function getAuthenticatedUser()
        {
                try {

                        if (! $user = JWTAuth::parseToken()->authenticate()) {
                                return response()->json(['user_not_found'], 404);
                        }

                } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

                        return response()->json(['token_expired'], $e->getStatusCode());

                } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

                        return response()->json(['token_invalid'], $e->getStatusCode());

                } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

                        return response()->json(['token_absent'], $e->getStatusCode());

                }

                return response()->json(compact('user'));
        }
}
