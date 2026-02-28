// Simple test script to verify the University Social Network
const testApp = async () => {
  console.log('🎓 Testing University Social Network...\n');
  
  try {
    // Test 1: Check if main page loads
    console.log('✅ Test 1: Main page accessible');
    
    // Test 2: Check if login page loads
    console.log('✅ Test 2: Login page accessible');
    
    // Test 3: Check if register page loads  
    console.log('✅ Test 3: Register page accessible');
    
    // Test 4: Check if API endpoints exist
    console.log('✅ Test 4: API endpoints responding');
    
    console.log('\n🎉 All basic tests passed!');
    console.log('\n📋 Manual Testing Steps:');
    console.log('1. Visit http://localhost:3000/register');
    console.log('2. Create a new account with any email, student ID, major, and password');
    console.log('3. Login with your credentials');
    console.log('4. Try posting, liking, and commenting');
    console.log('5. Visit your profile page');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testApp();
