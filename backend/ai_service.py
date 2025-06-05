import os
from typing import List, Dict, Any
import google.generativeai as genai
from langchain.memory import ConversationBufferWindowMemory
from langchain.schema import HumanMessage, AIMessage
import logging

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        
        # Initialize conversation memory
        self.memory = ConversationBufferWindowMemory(
            k=10,  # Keep last 10 exchanges
            return_messages=True
        )
        
        # System prompt for the AI
        self.system_prompt = """
        You are Zerbot, an intelligent AI assistant that can help with various tasks including:
        - Answering questions and having conversations
        - Explaining concepts and providing information
        - Helping with coding and programming
        - Generating executable programs when requested
        
        When users ask you to create executable programs, you should acknowledge their request
        and explain that you'll generate a Python program that will be compiled into an executable
        file that opens in a command prompt window.
        
        Be helpful, accurate, and engaging in your responses.
        """
    
    async def generate_response(self, message: str, session_history: List[Dict[str, str]]) -> str:
        try:
            # Build conversation context
            conversation_context = self.system_prompt + "\n\nConversation History:\n"
            
            # Add recent history
            for exchange in session_history[-5:]:  # Last 5 exchanges
                conversation_context += f"User: {exchange['user']}\n"
                conversation_context += f"Assistant: {exchange['assistant']}\n"
            
            conversation_context += f"\nUser: {message}\nAssistant:"
            
            # Generate response using Gemini
            response = self.model.generate_content(conversation_context)
            
            return response.text
            
        except Exception as e:
            logger.error(f"Error generating AI response: {str(e)}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again."
    
    def clear_memory(self):
        """Clear conversation memory"""
        self.memory.clear()