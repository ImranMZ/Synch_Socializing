import os
from groq import AsyncGroq
from dotenv import load_dotenv
from typing import Optional, Dict, Any
import asyncio
from collections import defaultdict
import time

env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

class GroqClient:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("[!] WARNING: GROQ_API_KEY not set. AI features will be disabled.")
            print("    Set GROQ_API_KEY in backend/.env file or environment variable.")
            self.client = None
        else:
            self.client = AsyncGroq(api_key=api_key)
        self.model = "llama-3.3-70b-versatile"
        self.request_cache: Dict[str, tuple[Any, float]] = {}
        self.cache_ttl = 300
        self.request_times: list = []
        self.lock = asyncio.Lock()
    
    def is_available(self) -> bool:
        return self.client is not None
    
    async def chat(
        self, 
        system_prompt: str, 
        user_message: str,
        temperature: float = 0.9,
        max_tokens: int = 1024
    ) -> str:
        cache_key = f"{system_prompt[:50]}:{user_message[:100]}:{temperature}"
        
        if cache_key in self.request_cache:
            result, timestamp = self.request_cache[cache_key]
            if time.time() - timestamp < self.cache_ttl:
                return result
        
        async with self.lock:
            current_time = time.time()
            self.request_times = [t for t in self.request_times if current_time - t < 60]
            
            if len(self.request_times) >= 25:
                wait_time = 60 - (current_time - self.request_times[0])
                if wait_time > 0:
                    await asyncio.sleep(wait_time)
                self.request_times = []
            
            self.request_times.append(time.time())
        
        if not self.is_available():
            return "AI features are disabled. Please set GROQ_API_KEY in backend/.env file to enable AI features."
        
        try:
            chat_completion = await self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                model=self.model,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            
            response = chat_completion.choices[0].message.content
            self.request_cache[cache_key] = (response, time.time())
            return response
            
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}. Please try again."

groq_client = GroqClient()

async def generate_ai_response(
    system_prompt: str,
    user_message: str,
    temperature: float = 0.9,
    max_tokens: int = 1024
) -> str:
    if not groq_client.is_available():
        return "AI features are disabled. Please set GROQ_API_KEY in backend/.env file to enable AI features."
        
    # Enforce conciseness only if not already specified in the prompt
    if "Limit your response" not in system_prompt and "sentences maximum" not in system_prompt:
        concise_prompt = system_prompt + "\n\nCRITICAL INSTRUCTION: Keep your response concise and direct. Avoid unnecessary filler."
    else:
        concise_prompt = system_prompt
    
    return await groq_client.chat(concise_prompt, user_message, temperature, max_tokens)
