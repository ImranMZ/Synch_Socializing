import os
from groq import AsyncGroq
from dotenv import load_dotenv
from typing import Optional, Dict, Any
import asyncio
from collections import defaultdict
import time

load_dotenv()

class GroqClient:
    def __init__(self):
        self.client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        self.request_cache: Dict[str, tuple[Any, float]] = {}
        self.cache_ttl = 300
        self.request_times: list = []
        self.lock = asyncio.Lock()
    
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
    return await groq_client.chat(system_prompt, user_message, temperature, max_tokens)
