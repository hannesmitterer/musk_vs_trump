#!/usr/bin/env python3
"""
Demo script for Musk vs Trump AI Reputation Tracker
Showcases the new social media sentiment analysis endpoints
"""

import requests
import json
import time
from datetime import datetime

def make_request(url, description):
    """Make API request and display results"""
    print(f"\n🔍 {description}")
    print("-" * 60)
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            return None
    except requests.RequestException as e:
        print(f"❌ Request failed: {str(e)}")
        return None

def display_reputation_summary(data, person_name):
    """Display reputation summary in a nice format"""
    if not data:
        return
    
    rep_data = data['reputation_data']
    print(f"👤 {person_name}")
    print(f"📊 Reputation Score: {rep_data['reputation_score']}/100")
    print(f"📈 Total Mentions: {rep_data['total_mentions']}")
    print(f"✅ Positive: {rep_data['positive_mentions']} ({rep_data['sentiment_distribution']['positive']}%)")
    print(f"❌ Negative: {rep_data['negative_mentions']} ({rep_data['sentiment_distribution']['negative']}%)")
    print(f"➖ Neutral: {rep_data['neutral_mentions']} ({rep_data['sentiment_distribution']['neutral']}%)")
    print(f"🔍 Data Source: {rep_data['data_source']}")

def main():
    """Main demo function"""
    base_url = "http://localhost:5000"
    
    print("🌐 Musk vs Trump AI Reputation Tracker - Demo")
    print("=" * 60)
    print(f"⏰ Demo started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test basic endpoints
    basic_response = make_request(f"{base_url}/", "Testing basic server status")
    if basic_response:
        print(f"✅ Server Response: {basic_response}")
    
    health_data = make_request(f"{base_url}/health", "Checking server health")
    if health_data:
        print(f"✅ Health Status: {health_data['status']} - {health_data['message']}")
    
    # Test Musk reputation
    musk_data = make_request(f"{base_url}/api/reputation/musk?limit=5", "Analyzing Elon Musk's Reputation")
    if musk_data:
        display_reputation_summary(musk_data, "Elon Musk")
    
    # Test Trump reputation  
    trump_data = make_request(f"{base_url}/api/reputation/trump?limit=5", "Analyzing Donald Trump's Reputation")
    if trump_data:
        display_reputation_summary(trump_data, "Donald Trump")
    
    # Test comparison
    comparison_data = make_request(f"{base_url}/api/reputation/compare?limit=3", "Comparing Reputation Scores")
    if comparison_data:
        comp_results = comparison_data['comparison_results']
        print(f"⚖️  Reputation Comparison")
        print(f"🏆 Winner: {comp_results['winner']}")
        print(f"📊 Score Difference: {comp_results['score_difference']:.1f} points")
        
        comp_data = comp_results['comparison']
        for person, data in comp_data.items():
            print(f"  • {person}: {data['reputation_score']}/100 ({data['total_mentions']} mentions)")
    
    # Test trending topics
    trending_data = make_request(f"{base_url}/api/trending", "Getting Trending Topics")
    if trending_data:
        print("📈 Trending Topics:")
        print(f"  🔸 Musk: {', '.join(trending_data['musk_trending'][:5])}")
        print(f"  🔸 Trump: {', '.join(trending_data['trump_trending'][:5])}")
        print(f"  🔸 General: {', '.join(trending_data['general_trending'])}")
    
    # Test API status
    status_data = make_request(f"{base_url}/api/status", "Checking API Status")
    if status_data:
        print(f"📊 API Status: {status_data['status']}")
        print(f"📈 Daily Credits Used: {status_data['daily_credits_used']}/{status_data['daily_credits_limit']}")
        print(f"🚀 API Version: {status_data['api_version']}")
        print(f"🌐 Supported Platforms: {len(status_data['supported_platforms'])} platforms")
    
    print("\n" + "=" * 60)
    print("🎉 Demo completed successfully!")
    print("💡 Try these URLs in your browser:")
    print(f"   • {base_url}/api/reputation/musk")
    print(f"   • {base_url}/api/reputation/trump")
    print(f"   • {base_url}/api/reputation/compare")
    print(f"   • {base_url}/api/trending")

if __name__ == "__main__":
    main()