import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;

import com.sun.org.apache.xml.internal.security.exceptions.Base64DecodingException;
import com.sun.org.apache.xml.internal.security.utils.Base64;


public class Generator {
	private String key;
	
	public Generator(String key) {
		this.key = key;
	}
	
	public String generatePublicKey() {
		try {
			byte[] decoded = Base64.decode(this.key);
			KeyFactory factory = KeyFactory.getInstance("RSA");
			RSAPublicKey pubKey = (RSAPublicKey)factory.generatePublic(new X509EncodedKeySpec(decoded));
			return Base64.encode(pubKey.getEncoded());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "";
		}
	}
	
	public static void main(String[] args) {
		Generator gen = new Generator("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAja44f+KCILhqQ1dIa8A8mxm6SLQ0nuHFrFIXpRlMMdu9d0oEZxOp49PywDzhB3a21z2GYZQfwXl1F6qp2TIYSsHeOtW+QuUzM64mWdYvdv6xTanUp7SR8DCPCvoEWXXCAyaKfxzuEMBqM8cQ/tyjN9e4Po2v4Se6aArDACGVlU9gdbw3iww9V2N5PPATtz1XaabSlj0JCzaF/TCKwXb/w+7Jrakem3a7kbAUh63+LQ3AcFdWLpv8qL0zGZgXJtl5KB4HaW6fnjWhGdjDhpPX0VtyVrLpD4TwpLYgPgTVquw7LuPYYWAuq/HQV3CJy5wceNfm1yp70BScILAnnsnLfwIDAQAB");
		
		System.out.println(gen.generatePublicKey());
	}
}
